import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { spawn } from 'node:child_process';

// 빌드 종료 후 OG 카드 PNG 생성 (scripts/generate-og.mjs)
const ogGeneration = () => ({
  name: 'og-image-generator',
  hooks: {
    'astro:build:done': async ({ logger }) => {
      logger.info('Generating OG cards…');
      await new Promise((resolve, reject) => {
        const proc = spawn('node', ['scripts/generate-og.mjs'], {
          stdio: 'inherit',
          shell: true,
        });
        proc.on('exit', (code) =>
          code === 0 ? resolve() : reject(new Error(`exit ${code}`)),
        );
      });
    },
  },
});

export default defineConfig({
  site: 'https://skkustem.org',
  integrations: [mdx(), sitemap(), ogGeneration()],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  build: {
    format: 'directory',
  },
});
