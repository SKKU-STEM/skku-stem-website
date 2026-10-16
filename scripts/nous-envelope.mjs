// 노스 소개 음성(public/nous/intro.mp3)에서 20fps 진폭 엔벌로프를 뽑아 src/components/nous/envelope.ts로 쓰는 생성기
// 사용: node scripts/nous-envelope.mjs  (음성을 교체하면 다시 실행)
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const input = `${root}public/nous/intro.mp3`;
const output = `${root}src/components/nous/envelope.ts`;

// 48kHz × 2400샘플 = 50ms 창. 창마다 RMS(dB)를 메타데이터로 출력한다.
const raw = execFileSync(
  'ffmpeg',
  [
    '-hide_banner', '-nostats', '-i', input,
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
    // −50dB(사실상 무음) … −10dB(크게 말함)를 0–9로 양자화 — 정규화(−19 LUFS)된 음성 기준
    return Math.min(9, Math.max(0, Math.round(((db + 50) / 40) * 9)));
  })
  .join('');

if (!levels) throw new Error('ffmpeg에서 RMS 값을 하나도 읽지 못했습니다');

writeFileSync(
  output,
  `// (생성물) scripts/nous-envelope.mjs가 intro.mp3에서 만든 20fps 진폭 엔벌로프 — 손으로 고치지 않는다\n` +
    `export const ENVELOPE = { fps: 20, levels: '${levels}' } as const;\n`,
);
console.log(`envelope.ts: ${levels.length} frames (${(levels.length / 20).toFixed(2)}s)`);
