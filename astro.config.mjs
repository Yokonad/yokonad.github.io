import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://yokonad.github.io',
  base: '/',
  // Oculta la barra de herramientas de desarrollo de Astro (solo aparecía en dev)
  devToolbar: { enabled: false },
  integrations: [
    // Usamos nuestro propio global.css con las directivas @tailwind,
    // así que desactivamos la inyección automática de estilos base.
    tailwind({ applyBaseStyles: false }),
  ],
});
