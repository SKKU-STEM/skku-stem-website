// 노스 소개 영상(public/nous/intro-{ko,en}.mp4)의 소리에서 20fps 진폭 엔벌로프를 뽑아 src/components/nous/envelope.ts로 쓰는 생성기
// 사용: node scripts/nous-envelope.mjs  (영상을 교체하면 다시 실행)
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = `${root}src/components/nous/envelope.ts`;

// 48kHz × 2400샘플 = 50ms 창. 창마다 RMS(dB)를 메타데이터로 출력한다.
const levelsOf = (input) => {
  const raw = execFileSync(
    'ffmpeg',
    [
      '-hide_banner', '-nostats', '-i', input, '-vn',
      '-af', 'aresample=48000,asetnsamples=2400,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-',
      '-f', 'null', '-',
    ],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] },
  );
  const levels = raw
    .split('\n')
    .filter((line) => line.startsWith('lavfi.astats.Overall.RMS_level='))
    .map((line) => {
      const v = line.split('=')[1].trim();
      const db = v === '-inf' ? -100 : Number(v);
      // −50dB(사실상 무음) … −10dB(크게 말함)를 0–9로 양자화 — 정규화(−18 LUFS)된 음성 기준
      return Math.min(9, Math.max(0, Math.round(((db + 50) / 40) * 9)));
    })
    .join('');
  if (!levels) throw new Error(`${input}에서 RMS 값을 하나도 읽지 못했습니다`);
  return levels;
};

const env = {};
for (const lang of ['ko', 'en']) {
  env[lang] = levelsOf(`${root}public/nous/intro-${lang}.mp4`);
  console.log(`${lang}: ${env[lang].length} frames (${(env[lang].length / 20).toFixed(2)}s)`);
}

writeFileSync(
  output,
  `// (생성물) scripts/nous-envelope.mjs가 intro-{ko,en}.mp4 소리에서 만든 20fps 진폭 엔벌로프 — 손으로 고치지 않는다\n` +
    `export const ENVELOPES = {\n` +
    Object.entries(env).map(([lang, levels]) => `  ${lang}: { fps: 20, levels: '${levels}' },\n`).join('') +
    `} as const;\n`,
);
