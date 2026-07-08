---
title: "Cap"
os: "Linux"
difficulty: "Easy"
date: "2026-07-07"
tags: ["web", "idor", "pcap", "capabilities", "privesc"]
summary: "Un IDOR en un panel web expone el PCAP de otro usuario con credenciales FTP en texto plano, reutilizables por SSH; la escalada a root se logra con la capability cap_setuid de Python."
platform: "HackTheBox"
icon: "/picture/writeups/cap-htb.webp"
---

- **Sistema operativo:** Linux — Ubuntu 20.04
- **IP objetivo:** `10.129.48.182`
- **Bandera de usuario:** `/home/nathan/user.txt`
- **Bandera de root:** `/root/root.txt`

## Resumen

Un panel web de seguridad genera capturas de tráfico y las expone en rutas numeradas sin comprobar de quién son (IDOR): cambiando el identificador se descarga el PCAP de otro usuario, que contiene una sesión FTP en texto plano con las credenciales de nathan; esas credenciales se reutilizan en SSH para el acceso inicial, y la escalada a root se consigue porque el binario de Python tiene la capability cap_setuid, que permite cambiar el UID a 0.

## 1. Conexión y comprobación del objetivo

Tras levantar la VPN, lo primero es confirmar que la máquina responde y sacar una primera pista de qué sistema operativo es. Un ping basta: el valor del TTL delata el SO, porque Linux parte de 64 y Windows de 128, y la VPN descuenta un salto.

```bash
ping -c 3 10.129.48.182
```

Responde con TTL 63, es decir 64 menos un salto: es un host **Linux**. Con esto ya sé que la enumeración irá orientada a servicios típicos de Linux.

## 2. Reconocimiento

Escaneo primero los 65535 puertos TCP para no dejarme nada abierto, y solo después lanzo la detección de versiones sobre los que aparezcan; hacerlo en dos fases es más rápido y menos ruidoso que pedir `-sV` sobre todo el rango.

```bash
sudo nmap -p- --min-rate 2000 -T4 -Pn -n 10.129.48.182
sudo nmap -p 21,22,80 -sC -sV -Pn -n 10.129.48.182
```

Aparecen tres puertos: **21 FTP** (vsftpd 3.0.3), **22 SSH** (OpenSSH 8.2p1, que confirma Ubuntu 20.04) y **80 HTTP** servido por **gunicorn**, con el título "Security Dashboard". Que el 80 corra sobre gunicorn me dice que es una aplicación Python (Flask por detrás), así que la superficie interesante está en la web: un panel hecho a medida suele tener lógica propia y fallos de autorización. El FTP queda anotado como posible destino de credenciales, y el SSH como la vía de acceso si consigo alguna.

## 3. Enumeración web y descubrimiento del IDOR

Descargo la página principal y extraigo sus enlaces para mapear la aplicación antes de tocar nada. Me interesa saber qué rutas existen y cuál genera contenido dinámico.

```bash
curl -s http://10.129.48.182/ | grep -Eio 'href="/[^"]*"' | sort -u
```

Salen las rutas `/capture`, `/data/<id>`, `/download/<id>`, `/ip` y `/netstat`. El panel tiene un botón de "Security Snapshot" que apunta a `/capture`, y al pedir esa ruta el servidor redirige a `/data/5` (un identificador numérico que corresponde a mi propia captura). Ese patrón —un recurso privado accesible por un número correlativo en la URL— es la señal clásica de un **IDOR**: si la aplicación no comprueba que la captura es mía, bastará con cambiar el número para ver las de otros. Lo pruebo pidiendo varios identificadores y observando el código de respuesta:

```bash
for id in 0 1 2 3 4 5; do
  echo -n "/data/$id -> "; curl -s -o /dev/null -w "%{http_code}\n" http://10.129.48.182/data/$id
done
```

Los identificadores `/data/0` y `/data/1` responden **200**: son capturas que no son mías y aun así puedo verlas. El IDOR está confirmado, y lo relevante es que estas capturas son de tráfico de red, así que dentro puede haberse colado información sensible de otros usuarios.

## 4. Extracción de credenciales del PCAP

Cada captura tiene un botón de descarga que apunta a `/download/<id>`, el mismo esquema numérico. Descargo la captura 0, que es la más antigua y por tanto la más probable de contener actividad de un administrador:

```bash
curl -s http://10.129.48.182/download/0 -o capture_0.pcap
```

En lugar de abrir Wireshark, para un vistazo rápido basta con extraer las cadenas de texto del PCAP y filtrar por los comandos del protocolo FTP, porque FTP viaja en texto plano y las credenciales aparecen literalmente con los verbos USER y PASS:

```bash
strings capture_0.pcap | grep -Ei 'USER |PASS '
```

Aparece la sesión FTP completa con `USER nathan` y `PASS Buck3tH4TF0RM3!`. Tengo unas credenciales válidas capturadas del tráfico de otro usuario; el siguiente paso es ver dónde funcionan.

## 5. Acceso inicial por SSH

Las credenciales son de FTP, pero la máquina también expone SSH, y la reutilización de contraseñas es lo primero que hay que probar: un usuario del sistema suele usar la misma clave para todo. Intento entrar por SSH como nathan. Aquí me topo con un fallo de la VPN: el handshake SSH se queda colgado en el intercambio de claves porque el paquete de respuesta es grande y se fragmenta mal sobre el túnel; se arregla bajando la MTU de la interfaz antes de conectar.

```bash
sudo ip link set dev tun0 mtu 1200
sshpass -p 'Buck3tH4TF0RM3!' ssh nathan@10.129.48.182
cat ~/user.txt
```

La contraseña de FTP funciona tal cual en SSH: entro como nathan y leo la bandera de usuario en /home/nathan/user.txt. Ya tengo un punto de apoyo en el sistema; ahora toca escalar.

## 6. Escalada a root por capability cap_setuid

Con una shell de usuario, antes de buscar exploits reviso las vías rápidas de escalada. Las capabilities son de las más directas cuando están mal puestas, así que enumero qué binarios las tienen:

```bash
getcap -r / 2>/dev/null
```

El resultado clave es `/usr/bin/python3.8 = cap_setuid+eip`. La capability cap_setuid permite a ese binario cambiar su UID sin ser root, y como Python ejecuta código arbitrario, puedo pedirle que ponga el UID a 0 y lance una shell, que arrancará ya como root:

```bash
/usr/bin/python3.8 -c 'import os; os.setuid(0); os.system("/bin/bash")'
cat /root/root.txt
```

`os.setuid(0)` me convierte en root gracias a la capability, la shell resultante corre como uid 0 y con ella leo la bandera final en /root/root.txt.

## Resumen de la cadena

El reconocimiento descubre FTP, SSH y un panel web "Security Dashboard" en gunicorn. El panel genera capturas de tráfico y las publica en rutas numeradas `/data/<id>` y `/download/<id>` sin comprobar la propiedad, un IDOR que permite descargar el PCAP de otro usuario. Ese PCAP contiene una sesión FTP en texto plano con las credenciales de nathan, que se reutilizan en SSH para el acceso inicial (bajando antes la MTU de la VPN para que el handshake no se cuelgue). Ya como nathan, el binario /usr/bin/python3.8 tiene la capability cap_setuid, que permite cambiar el UID a 0 y obtener una shell de root con la que se lee la bandera final.
