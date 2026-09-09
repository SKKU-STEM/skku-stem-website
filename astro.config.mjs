import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { FontaineTransform } from 'fontaine';
import { spawn } from 'node:child_process';

import cloudflare from "@astrojs/cloudflare";

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
    plugins: [
      tailwindcss(),
      // 폰트 swap 시 reflow(CLS) 제거 — 시스템 폰트의 metric을 Inter/Newsreader/Mono와 거의 일치하게 override.
      // Fontsource @font-face 선언을 자동 파싱해 'X Fallback' @font-face + size-adjust/ascent-override 생성.
      FontaineTransform.vite({
        fallbacks: ['Arial', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        resolvePath: (id) => new URL(`./node_modules/${id.replace(/^\//, '')}`, import.meta.url),
      }),
    ],
  },

  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },

  build: {
    format: 'directory',
  },

  adapter: cloudflare()
});