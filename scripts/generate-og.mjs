// 페이지별 1200×630 OG 카드 PNG 생성 — Satori (JSX → SVG) + sharp (SVG → PNG)
// astro.config.mjs의 'astro:build:done' 훅에서 호출되어 dist/og/<slug>.png 생성.
// 디자인: cream 배경 + 좌측 Newsreader 타이틀 + 우측 코랄 원자 격자 (사이트 hero 모티프 압축).
import satori from 'satori';
import sharp from 'sharp';
import wawoff2 from 'wawoff2';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// ─── 디자인 토큰 (global.css의 @theme와 일치) ───
const CREAM = '#FAF9F5';
const INK = '#141413';
const INK_70 = '#5C5B57';
const CORAL = '#CC785C';
const CORAL_700 = '#8C4D3A';

// ─── 페이지 메타 (URL slug → OG 텍스트) ───
const PAGES = [
  {
    slug: 'home',
    eyebrow: 'SKKU-STEM Lab',
    title: 'Decoding matter, atom by atom',
    description:
      'A laboratory at the intersection of scanning transmission electron microscopy, electron spectroscopy, and machine learning.',
  },
  {
    slug: 'research',
    eyebrow: 'Research',
    title: 'Resolving matter',
    description:
      'Six thrusts at the intersection of microscopy, spectroscopy, and ML — applied to energy materials.',
  },
  {
    slug: 'people',
    eyebrow: 'People',
    title: 'The SKKU-STEM lab',
    description:
      'Postdoctoral researchers, graduate and undergraduate students, and alumni of the SKKU-STEM Laboratory.',
  },
  {
    slug: 'people-pi',
    eyebrow: 'Principal Investigator',
    title: 'Young-Min Kim',
    description:
      'Professor, Department of Energy Science, Sungkyunkwan University. Atomic-scale microscopy for energy materials.',
  },
  {
    slug: 'publications',
    eyebrow: 'Publications',
    title: 'Peer-reviewed work',
    description:
      'SCI papers from the SKKU-STEM Laboratory at Sungkyunkwan University.',
  },
  {
    slug: 'publications-before-skku',
    eyebrow: 'Publications · Before SKKU',
    title: 'Earlier career, 2000–2015',
    description:
      'Pre-SKKU peer-reviewed work — graduate studies, KAIST Ph.D., and the ORNL postdoctoral fellowship.',
  },
  {
    slug: 'publications-non-sci-patents',
    eyebrow: 'Publications · Non-SCI & Patents',
    title: 'Patents, books, and other writing',
    description:
      'Granted patents (Korea / USA), non-SCI publications, and books from the SKKU-STEM Laboratory.',
  },
  {
    slug: 'news',
    eyebrow: 'News',
    title: 'Lab news',
    description:
      'Recent papers, awards, talks, member milestones, and lab events.',
  },
  {
    slug: 'gallery',
    eyebrow: 'Gallery',
    title: 'Lab moments',
    description:
      'Group photos from SKKU-STEM Lab events, conferences, awards, and gatherings.',
  },
  {
    slug: 'facilities',
    eyebrow: 'Facilities',
    title: 'Atomic-resolution instruments',
    description:
      'Aberration-corrected scanning transmission electron microscopes for atomic-resolution imaging and chemical mapping.',
  },
];

// ─── 폰트 로드 (Fontsource static — variable는 satori opentype.js parser와 호환 안 됨) ───
// woff2 → TTF 변환 (satori는 OpenType/TrueType만 받음).
// wawoff2는 내부 emscripten 메모리 버퍼를 재사용 → 결과를 즉시 새 Buffer로 복사해야 함.
const decompress = async (p) => Buffer.from(await wawoff2.decompress(readFileSync(p)));
const NR_400 = await decompress(
  'node_modules/@fontsource/newsreader/files/newsreader-latin-400-normal.woff2',
);
const INTER_400 = await decompress(
  'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2',
);
const INTER_600 = await decompress(
  'node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2',
);

// ─── 우측 원자 격자 모티프 (홈 hero SVG 압축) ───
const motifAtoms = [];
for (let row = 0; row < 7; row++) {
  for (let col = 0; col < 5; col++) {
    motifAtoms.push({
      type: 'div',
      props: {
        style: {
          position: 'absolute',
          left: `${col * 70 + 14}px`,
          top: `${row * 70 + 14}px`,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: INK,
          opacity: 0.18,
        },
      },
    });
  }
}

// 강조 원자 (코랄 글로우 + 점)
const featuredAtom = {
  type: 'div',
  props: {
    style: {
      position: 'absolute',
      left: '230px',
      top: '230px',
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      background: CORAL,
      opacity: 0.18,
    },
  },
};
const featuredCore = {
  type: 'div',
  props: {
    style: {
      position: 'absolute',
      left: '278px',
      top: '278px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: CORAL,
    },
  },
};

// ─── JSX-like 트리 빌더 ───
function makeCard({ eyebrow, title, description }) {
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        background: CREAM,
        fontFamily: 'Inter',
        position: 'relative',
      },
      children: [
        // 좌측 텍스트 컬럼
        {
          type: 'div',
          props: {
            style: {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: '72px 64px 64px 80px',
              justifyContent: 'space-between',
            },
            children: [
              // 상단 — eyebrow
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontSize: 22,
                    fontFamily: 'Inter',
                    color: CORAL_700,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  },
                  children: eyebrow,
                },
              },
              // 중앙 — title + description
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column' },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontSize: 78,
                          fontFamily: 'Newsreader',
                          color: INK,
                          letterSpacing: '-0.02em',
                          lineHeight: 1.05,
                          fontWeight: 400,
                        },
                        children: title,
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          marginTop: 28,
                          fontSize: 26,
                          fontFamily: 'Inter',
                          color: INK_70,
                          lineHeight: 1.4,
                          maxWidth: '660px',
                        },
                        children: description,
                      },
                    },
                  ],
                },
              },
              // 하단 — 도메인
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 20,
                    fontFamily: 'Inter',
                    color: INK,
                    fontWeight: 500,
                  },
                  children: [
                    {
                      type: 'span',
                      props: { children: 'skkustem.org' },
                    },
                    {
                      type: 'span',
                      props: {
                        style: {
                          margin: '0 12px',
                          color: INK_70,
                        },
                        children: '·',
                      },
                    },
                    {
                      type: 'span',
                      props: {
                        style: { color: INK_70 },
                        children: 'Sungkyunkwan University',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // 우측 모티프 컬럼 (컨테이너 폭 ~400px)
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              width: '380px',
              height: '630px',
              position: 'relative',
              borderLeft: `1px solid ${INK}1A`,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    position: 'absolute',
                    inset: 0,
                  },
                  children: [...motifAtoms, featuredAtom, featuredCore],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

// ─── 메인 ───
async function main() {
  const distDir = path.resolve('dist/og');
  mkdirSync(distDir, { recursive: true });

  for (const page of PAGES) {
    const tree = makeCard(page);
    const svg = await satori(tree, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: INTER_400, weight: 400, style: 'normal' },
        { name: 'Inter', data: INTER_600, weight: 600, style: 'normal' },
        { name: 'Newsreader', data: NR_400, weight: 400, style: 'normal' },
      ],
    });

    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    const out = path.join(distDir, `${page.slug}.png`);
    writeFileSync(out, png);
    console.log(`  ${page.slug}.png  (${(png.length / 1024).toFixed(0)} KB)`);
  }
}

main().catch((e) => {
  console.error('OG generation failed:', e);
  process.exitCode = 1;
});
