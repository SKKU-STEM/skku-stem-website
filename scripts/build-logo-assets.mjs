// public/logo.png(RGB only)으로부터 알파 채널이 있는 파생 파일 생성
//   - public/logo-mark.png — 검정 로고 + 알파 (Logo 컴포넌트의 CSS mask 입력용)
//   - public/favicon.png   — coral 채워진 256×256 favicon
//   - public/favicon.svg   — SVG wrapper에 base64 favicon.png 삽입 (벡터 favicon)
//
// 사용: npm run logo:build (또는 node scripts/build-logo-assets.mjs)
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const SOURCE = 'public/logo.png';
const CORAL = { r: 0xCC, g: 0x78, b: 0x5C };

const { data, info } = await sharp(SOURCE)
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
console.log(`Source: ${width}×${height}, ${channels} channels`);

// 알파 채널: 역광도 (luminance 반전). 검정 로고 픽셀 → 알파 255, 흰 배경 → 알파 0.
const alphas = new Uint8Array(width * height);
for (let i = 0; i < width * height; i++) {
  const r = data[i * channels];
  const g = data[i * channels + 1];
  const b = data[i * channels + 2];
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  alphas[i] = Math.round(255 - lum);
}

// 1. logo-mark.png: 검정 RGB + 알파 (CSS mask 입력으로 정확히 동작)
const blackRgba = Buffer.alloc(width * height * 4);
for (let i = 0; i < width * height; i++) {
  blackRgba[i * 4 + 3] = alphas[i]; // R/G/B는 0 그대로 둠
}

await sharp(blackRgba, { raw: { width, height, channels: 4 } })
  .png()
  .toFile('public/logo-mark.png');
console.log('✓ public/logo-mark.png');

// 2. favicon.png: coral 채워진 256×256
const coralRgba = Buffer.alloc(width * height * 4);
for (let i = 0; i < width * height; i++) {
  coralRgba[i * 4]     = CORAL.r;
  coralRgba[i * 4 + 1] = CORAL.g;
  coralRgba[i * 4 + 2] = CORAL.b;
  coralRgba[i * 4 + 3] = alphas[i];
}

const faviconPng = await sharp(coralRgba, { raw: { width, height, channels: 4 } })
  .resize(256, 256, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

await writeFile('public/favicon.png', faviconPng);
console.log('✓ public/favicon.png (256×256)');

// 3. favicon.svg: SVG wrapper + base64 PNG 삽입 (벡터, 자체완결)
const base64 = faviconPng.toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <image href="data:image/png;base64,${base64}" width="256" height="256" />
</svg>
`;
await writeFile('public/favicon.svg', svg);
console.log('✓ public/favicon.svg');

console.log('\nDone. Header / favicon에 적용하려면:');
console.log('  - Logo.astro: mask:url(/logo-mark.png) + bg-coral 유지');
console.log('  - BaseLayout.astro: <link rel="icon" type="image/svg+xml" href="/favicon.svg" />');
