# Estructura del proyecto — yokonad.online

Sitio personal hecho con **Astro + React + Tailwind**, desplegado en **GitHub Pages**
(dominio `yokonad.online`). Este documento explica **dónde va cada cosa** para no perderte.

> Regla de oro: el código vive en `src/`, los archivos servidos tal cual (imágenes,
> PDFs, sitemap) viven en `public/`. Lo que pongas en `public/` se sirve desde la raíz
> del sitio: `public/picture/x.webp` → se usa como `/picture/x.webp`.

---

## Árbol general

```
.
├── docs/                      ← documentación (esta carpeta, no se publica)
├── public/                    ← se sirve TAL CUAL desde la raíz del sitio
│   ├── picture/               ← todas las imágenes, organizadas por tipo
│   │   ├── avatars/           ← fotos de personas / equipo
│   │   ├── logos/             ← logos e íconos de marca + favicon
│   │   ├── pins/              ← "pines" decorativos de la portada
│   │   └── writeups/          ← íconos de cada máquina HTB + banner
│   ├── certificate/           ← certificados en PDF
│   └── robots.txt             ← el sitemap se genera solo (ver abajo)
├── src/                       ← código fuente
│   ├── components/            ← componentes reutilizables (.astro / .jsx)
│   ├── content/writeups/      ← los write-ups en Markdown (uno por máquina)
│   ├── data/content.js        ← datos del sitio (perfil, proyectos, equipo…)
│   ├── layouts/Layout.astro   ← plantilla base (SEO, fuentes, <head>)
│   ├── pages/                 ← cada archivo = una URL
│   ├── styles/global.css      ← estilos globales + animaciones
│   └── content.config.ts      ← esquema (Zod) de la colección de write-ups
├── astro.config.mjs           ← config de Astro (dominio, integraciones, Shiki)
├── tailwind.config.js
└── .github/workflows/deploy.yml  ← despliegue automático a GitHub Pages
```

---

## Dónde colocar cada cosa

### 🖼️ Imágenes → `public/picture/<categoría>/`

| Qué es | Carpeta | Se usa como |
|---|---|---|
| Ícono de una máquina HTB | `public/picture/writeups/` | `/picture/writeups/<slug>.webp` |
| Banner pixel-art de los write-ups | `public/picture/writeups/makesense-face.png` | `/picture/writeups/makesense-face.png` |
| Logos y marca (HTB, Linux, CyberSen…) | `public/picture/logos/` | `/picture/logos/<archivo>` |
| Favicon | `public/picture/logos/linux.ico` | referenciado en `Layout.astro` |
| Pines decorativos de la portada | `public/picture/pins/` | `/picture/pins/<archivo>` |
| Fotos de personas / equipo | `public/picture/avatars/` | `/picture/avatars/<archivo>` |

> Formato recomendado: **`.webp`** (ligero). Nombra en minúsculas con guiones.

### 📄 Certificados → `public/certificate/`

PDFs de certificaciones. Actualmente no están enlazados desde ninguna página
(pendiente de una futura sección "Certificaciones").

### 📝 Write-ups → `src/content/writeups/<slug>.md`

Cada máquina es **un archivo Markdown**. Al añadirlo, la página se genera sola.
Ver la guía completa más abajo.

### 🧩 Componentes → `src/components/`

| Componente | Para qué sirve |
|---|---|
| `Terminal.astro` | Bloque de código con estilo de terminal negra (comandos en verde) |
| `PixelEye.astro` | Ojo pixel-art (fase de reconocimiento) |
| `PixelSprite.astro` | Sprite 8-bit multi-frame genérico (animaciones de la "ruta") |
| `PixelFlag.astro` | Banderita pixel-art ondeante (flags USER/ROOT) |
| `HtbTerminal.jsx` | Terminal React que simula la conexión VPN (isla interactiva) |

### 🎨 Estilos → `src/styles/global.css`

Un único archivo global: variables de tema, componentes visuales (`.win`, `.term`,
`.wu-prose`, `.pxflag`, `.pxsprite`, modal `.ruta-dialog`…) y las animaciones.

### 🗂️ Datos del sitio → `src/data/content.js`

Perfil, enlaces, proyectos, equipo y comunidad de la **portada**. Editar aquí, no en el HTML.

### 📃 Páginas → `src/pages/` (cada archivo = una URL)

| Archivo | URL |
|---|---|
| `index.astro` | `/` (portada) |
| `writeups.astro` | `/writeups` (índice + tarjeta "La ruta que sigo") |
| `writeups/[slug].astro` | `/writeups/<slug>` (render automático de cada `.md`) |
| `writeups/htb-makesense.astro` | `/writeups/htb-makesense` (página **hecha a mano**) |
| `sitemap.xml.ts` | `/sitemap.xml` (se **genera solo** con todas las páginas + write-ups) |

---

## Cómo añadir un write-up nuevo

1. **Ícono de la máquina** → `public/picture/writeups/<slug>-htb.webp`.
2. **Archivo Markdown** → `src/content/writeups/htb-<nombre>.md` con este frontmatter:

   ```yaml
   ---
   title: "Nombre"
   os: "Linux"            # Linux | Windows | Otro
   difficulty: "Easy"     # Easy | Medium | Hard | Insane
   date: "2026-07-07"
   tags: ["web", "privesc"]
   summary: "Resumen de una línea de la cadena de ataque."
   platform: "HackTheBox"
   icon: "/picture/writeups/<slug>-htb.webp"
   ---
   ```

3. **Cuerpo del `.md`** (el orden importa, así se estiliza solo):
   - Primera lista = **ficha del objetivo** (SO, IP, banderas). Ejemplo:
     ```markdown
     - **Sistema operativo:** Linux — Ubuntu
     - **IP objetivo:** `10.10.10.10`
     - **Bandera de usuario:** `/home/user/user.txt`
     - **Bandera de root:** `/root/root.txt`
     ```
   - Secciones con `## N. Título` → el número se vuelve un **badge** con efecto scramble.
   - Bloques ```` ```bash ```` → se pintan como **terminal negra**.

4. **Banderitas capturadas**: escribe un blockquote con el marcador donde obtienes cada flag:
   ```markdown
   > [FLAG:USER] Bandera de usuario capturada en `/home/user/user.txt`.
   > [FLAG:ROOT] Bandera de root capturada en `/root/root.txt`.
   ```
   Se transforman automáticamente en la caja con banderita ondeante (verde/rojo).

5. Listo: `/writeups/<slug>` existe y aparece en el índice. (El nuevo aparecerá
   ordenado por `date`, descendente.)

> ¿Quieres una página **totalmente a medida** como `htb-makesense`? Crea
> `src/pages/writeups/<slug>.astro` y añade el `slug` a `CUSTOM_PAGES` dentro de
> `getStaticPaths()` en `writeups/[slug].astro` para que no se genere dos veces.

---

## Despliegue

Cada `git push` a `main` dispara `.github/workflows/deploy.yml`, que hace
`pnpm build` y publica `dist/` en GitHub Pages. El dominio `yokonad.online` está
configurado en los *Settings* del repositorio (no hace falta archivo `CNAME`).

Comandos locales:

```bash
pnpm dev      # servidor de desarrollo (http://localhost:4321)
pnpm build    # genera dist/ (lo mismo que hace el deploy)
pnpm preview  # previsualiza el build de producción
```
