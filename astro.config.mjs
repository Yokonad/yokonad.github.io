import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://yokonad.online',
  base: '/',
  // Oculta la barra de herramientas de desarrollo de Astro (solo aparecía en dev)
  devToolbar: { enabled: false },
  // Los bloques de código de los write-ups (Shiki) usan el tema "css-variables"
  // para heredar la paleta del sitio en vez de los colores fijos de un tema externo.
  // Las variables --shiki-* se definen en .wu-prose dentro de global.css.
  markdown: {
    shikiConfig: { theme: 'css-variables' },
  },
  integrations: [
    // React solo se usa para la terminal interactiva de /writeups (isla).
    react(),
    // Usamos nuestro propio global.css con las directivas @tailwind,
    // así que desactivamos la inyección automática de estilos base.
    tailwind({ applyBaseStyles: false }),
  ],
});
