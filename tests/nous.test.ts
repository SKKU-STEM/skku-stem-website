// 노스 카드의 순수 로직(언어별 자막 시각 판정·시간 표기·엔벌로프·mailto·진로 집계) 단위 테스트 — npx tsx --test tests/nous.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_LANG,
  LANGS,
  PARAGRAPHS,
  VOICES,
  activeParagraph,
  ampAt,
  ctaExpanded,
  formatClock,
  formatSpoken,
  mailtoHref,
  paragraphStart,
  visibleGraphics,
} from '../src/components/nous/nous.ts';
import { ENVELOPES } from '../src/components/nous/envelope.ts';
import { classifyAffiliation, isStaffRole, tallyCareers } from '../src/components/nous/careers.ts';

test('기본 언어는 한국어', () => {
  assert.equal(DEFAULT_LANG, 'ko');
  assert.deepEqual([...LANGS], ['ko', 'en']);
});

test('activeParagraph 경계 — 한국어 낭독 트랙', () => {
  const cases = [
    [0, 0], [6.15, 0], [6.16, 1], [28.55, 1], [28.56, 2],
    [56.64, 3], [76.87, 3], [76.88, 4], [92.2, 4], [-1, 0], [Number.NaN, 0],
  ] as const;
  for (const [t, i] of cases) assert.equal(activeParagraph(t, 'ko'), i, `ko t=${t}`);
});

test('activeParagraph 경계 — 영어 낭독 트랙', () => {
  const cases = [[5.83, 0], [5.84, 1], [27.11, 1], [27.12, 2], [52.4, 3], [72.55, 3], [72.56, 4]] as const;
  for (const [t, i] of cases) assert.equal(activeParagraph(t, 'en'), i, `en t=${t}`);
});

test('그래픽은 문단 따라 누적, CTA는 문단5 또는 ended — 언어별 시각', () => {
  assert.deepEqual(visibleGraphics(3, 'ko'), []);
  assert.deepEqual(visibleGraphics(10, 'ko'), ['research']);
  assert.deepEqual(visibleGraphics(28, 'ko'), ['research']);
  assert.deepEqual(visibleGraphics(28, 'en'), ['research', 'market']);
  assert.deepEqual(visibleGraphics(60, 'ko'), ['research', 'market', 'careers']);
  assert.equal(ctaExpanded(76, false, 'ko'), false);
  assert.equal(ctaExpanded(76, false, 'en'), true);
  assert.equal(ctaExpanded(76.88, false, 'ko'), true);
  assert.equal(ctaExpanded(5, true, 'ko'), true);
});

test('언어 전환은 같은 문단의 시작으로', () => {
  assert.equal(paragraphStart(activeParagraph(40, 'ko'), 'en'), 27.12);
  assert.equal(paragraphStart(activeParagraph(80, 'en'), 'ko'), 76.88);
  assert.equal(paragraphStart(0, 'en'), 0);
});

test('언어별 영상', () => {
  assert.equal(VOICES.ko.src, '/nous/intro-ko.mp4');
  assert.equal(VOICES.en.src, '/nous/intro-en.mp4');
  assert.equal(VOICES.ko.label, formatClock(VOICES.ko.duration));
  assert.equal(VOICES.en.label, formatClock(VOICES.en.duration));
  // 마지막 문단 시작은 영상 길이 안
  for (const l of LANGS) assert.ok(paragraphStart(4, l) < VOICES[l].duration, l);
});

test('시간 표기', () => {
  assert.equal(formatClock(92.24), '1:32');
  assert.equal(formatClock(35.9), '0:35');
  assert.equal(formatClock(5), '0:05');
  assert.equal(formatSpoken(92.24), '1분 32초');
  assert.equal(formatSpoken(0), '0분 0초');
});

test('ampAt', () => {
  assert.equal(ampAt('09', 20, 0.06), 1);
  assert.equal(ampAt('09', 20, 0), 0);
  assert.equal(ampAt('09', 20, 5), 0);
  assert.equal(ampAt('09', 20, -1), 0);
});

test('엔벌로프 길이 = 언어별 영상 길이', () => {
  for (const l of LANGS) {
    const e = ENVELOPES[l];
    assert.ok(Math.abs(e.levels.length - Math.ceil(VOICES[l].duration * e.fps)) <= 2, l);
    assert.match(e.levels, /^[0-9]+$/);
  }
});

test('원고 데이터 — v2', () => {
  assert.equal(PARAGRAPHS.length, 5);
  assert.ok(PARAGRAPHS[0].en.startsWith("Hi, I'm Nous"));
  assert.ok(PARAGRAPHS[1].en.startsWith("We don't make materials"));
  assert.ok(PARAGRAPHS[4].ko.includes('youngmk@skku.edu'));
  assert.ok(PARAGRAPHS.every((p) => p.ko.length > 0 && !p.en.includes('\n')));
  // 시각은 언어마다 오름차순
  for (const l of LANGS) assert.ok(PARAGRAPHS.every((p, i) => i === 0 || p.start[l] > PARAGRAPHS[i - 1].start[l]), l);
});

test('mailto', () => {
  const h = mailtoHref();
  assert.ok(h.startsWith('mailto:youngmk@skku.edu?subject='));
  assert.ok(decodeURIComponent(h).includes('관심 과정(학부연구생 / 석박통합 / 석사 / 박사):'));
});

// 2026-10-16 People Alumni 16명의 role·currentAffiliation 원문
const ALUMNI = [
  { role: 'Ph.D. (2020-2026)', currentAffiliation: 'SEMES (2026-present)' },
  { role: "Master's degree · 2018–2020", currentAffiliation: 'LG Energy Solution (2024–present); Samsung Electronics (2020–2023)' },
  { role: 'Ph.D. course · 2020–2025', currentAffiliation: 'Lam Research (2025–present)' },
  { role: 'Integrated course · 2019–2025', currentAffiliation: 'KAIST (2025–present)' },
  { role: 'Research Professor · 2017', currentAffiliation: 'Dong-shin University, Assistant Professor (2018–present)' },
  { role: "Master's degree · 2020–2022", currentAffiliation: 'LG Energy Solution (2022–present)' },
  { role: "Master's degree · 2023–2025", currentAffiliation: 'National Nanofab Center (NNFC, 2026–present)' },
  { role: 'Integrated course · 2019–2025', currentAffiliation: 'Korea Research Institute of Standards and Science (KRISS, 2026–present)' },
  { role: 'Integrated course · 2020–2026', currentAffiliation: 'Lam Research (2026–present)' },
  { role: 'Postdoctoral researcher · 2021–2022', currentAffiliation: 'SK Hynix (2022–present)' },
  { role: 'MS-PhD Integrated course · 2017–2023', currentAffiliation: 'Samsung Electronics (2023–present)' },
  { role: 'MS-PhD Integrated course · 2017–2024', currentAffiliation: 'Samsung Electronics (2024–present)' },
  { role: 'Research Professor · 2024', currentAffiliation: 'Korea Institute of Science and Technology (KIST, 2025–present)' },
  { role: 'Researcher · 2018–2024', currentAffiliation: 'ENF Technology (2024–present)' },
  { role: 'MS-PhD Integrated course · 2018–2024', currentAffiliation: 'Oak Ridge National Laboratory, USA (2024–present)' },
  { role: "Master's degree · 2023–2026", currentAffiliation: 'SK Hynix (2026–present)' },
];

test('현재 소속 = 세미콜론 앞', () => {
  assert.equal(classifyAffiliation('LG Energy Solution (2024–present); Samsung Electronics (2020–2023)'), 'maker');
});

test('KIST와 KAIST 구분', () => {
  assert.equal(classifyAffiliation('Korea Institute of Science and Technology (KIST, 2025–present)'), 'institute');
  assert.equal(classifyAffiliation('KAIST (2025–present)'), 'academia');
});

test('연구직 판정', () => {
  for (const r of ['Research Professor · 2017', 'Postdoctoral researcher · 2021–2022', 'Researcher · 2018–2024'])
    assert.ok(isStaffRole(r), r);
  for (const r of ['Ph.D. (2020-2026)', "Master's degree · 2018–2020", 'MS-PhD Integrated course · 2017–2023', 'Ph.D. course · 2020–2025'])
    assert.ok(!isStaffRole(r), r);
});

test('실데이터 16명', () => {
  const r = tallyCareers(ALUMNI);
  assert.deepEqual([r.total, r.degree, r.staff], [16, 12, 4]);
  assert.deepEqual(
    r.bars.map((b) => [b.id, b.degree, b.staff]),
    [['maker', 5, 1], ['equipment', 3, 1], ['institute', 2, 1], ['academia', 1, 1], ['overseas', 1, 0]],
  );
  assert.deepEqual(r.span, { min: 2017, max: 2026 });
});

test('모르는 소속은 기타, 빈 소속은 제외', () => {
  const r = tallyCareers([
    { role: 'Ph.D. · 2020–2027', currentAffiliation: 'Acme Corp' },
    { role: 'x', currentAffiliation: '' },
    {},
  ]);
  assert.equal(r.total, 1);
  assert.deepEqual(r.bars.map((b) => b.id), ['other']);
});
