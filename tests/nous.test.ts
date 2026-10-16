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
