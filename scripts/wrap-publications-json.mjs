// publications JSON 4개 파일을 bare array → { "items": [...] } 형태로 감싸는 일회성 스크립트.
// Sveltia/Decap CMS의 file collection은 객체 루트를 요구한다. 각 item의 id 필드는 유지.
// 사용: node scripts/wrap-publications-json.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const files = [
  'src/content/publications/skku.json',
  'src/content/publications/before-skku.json',
  'src/content/publications/non-sci-patents.json',
  'src/content/publications/pi-selected.json',
];

for (const rel of files) {
  const path = resolve(rel);
  const raw = readFileSync(path, 'utf8');
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    console.log(`skip (already wrapped): ${rel}`);
    continue;
  }

  const wrapped = { items: data };
  writeFileSync(path, JSON.stringify(wrapped, null, 2) + '\n', 'utf8');
  console.log(`wrapped: ${rel} (${data.length} items)`);
}
