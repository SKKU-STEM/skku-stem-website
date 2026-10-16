// 노스 카드의 순수 로직(자막 시각 판정·시간 표기·엔벌로프·mailto·진로 집계) 단위 테스트 — npx tsx --test tests/nous.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PARAGRAPHS,
  VOICE,
  activeParagraph,
  ampAt,
  ctaExpanded,
  formatClock,
  formatSpoken,
  mailtoHref,
  visibleGraphics,
} from '../src/components/nous/nous.ts';
import { ENVELOPE } from '../src/components/nous/envelope.ts';
import { classifyAffiliation, isStaffRole, tallyCareers } from '../src/components/nous/careers.ts';

test('activeParagraph 경계(v1 +0.3s)', () => {
  const cases = [
    [0, 0], [6.69, 0], [6.7, 1], [34.8, 2], [51.99, 2],
    [52, 3], [69.3, 4], [79.5, 4], [-1, 0], [Number.NaN, 0],
  ] as const;
  for (const [t, i] of cases) assert.equal(activeParagraph(t), i, `t=${t}`);
});

test('그래픽은 문단 따라 누적, CTA는 문단5 또는 ended', () => {
  assert.deepEqual(visibleGraphics(3), []);
  assert.deepEqual(visibleGraphics(10), ['research']);
  assert.deepEqual(visibleGraphics(40), ['research', 'market']);
  assert.deepEqual(visibleGraphics(60), ['research', 'market', 'careers']);
  assert.equal(ctaExpanded(60, false), false);
  assert.equal(ctaExpanded(69.3, false), true);
  assert.equal(ctaExpanded(5, true), true);
});

test('시간 표기', () => {
  assert.equal(formatClock(79.5), '1:19');
  assert.equal(formatClock(35.9), '0:35');
  assert.equal(formatClock(5), '0:05');
  assert.equal(formatSpoken(79.5), '1분 19초');
  assert.equal(formatSpoken(0), '0분 0초');
});

test('ampAt', () => {
  assert.equal(ampAt('09', 20, 0.06), 1);
  assert.equal(ampAt('09', 20, 0), 0);
  assert.equal(ampAt('09', 20, 5), 0);
  assert.equal(ampAt('09', 20, -1), 0);
});

test('엔벌로프 길이 = 음성 길이', () => {
  assert.ok(Math.abs(ENVELOPE.levels.length - Math.ceil(VOICE.duration * ENVELOPE.fps)) <= 2);
  assert.match(ENVELOPE.levels, /^[0-9]+$/);
});

test('원고 데이터', () => {
  assert.equal(PARAGRAPHS.length, 5);
  assert.ok(PARAGRAPHS[0].en.startsWith("Hi, I'm Nous"));
  assert.ok(PARAGRAPHS.every((p) => p.ko.length > 0 && !p.en.includes('\n')));
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
