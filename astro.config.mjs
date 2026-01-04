// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://solomonneas.github.io/astro-portfolio',
  vite: {
    plugins: [tailwindcss()]
  }
});