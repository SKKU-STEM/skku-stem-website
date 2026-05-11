// Lighthouse 일괄 감사 — 9개 라이브 URL을 headless Chrome으로 측정해 JSON + 요약 출력
// 사용: node scripts/lighthouse-audit.mjs [--base=https://skkustem.org]
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const baseArg = process.argv.find((a) => a.startsWith('--base='));
const BASE = (baseArg ? baseArg.split('=')[1] : 'https://skkustem.org').replace(/\/$/, '');

const ROUTES = [
  ['home', '/'],
  ['research', '/research/'],
  ['people', '/people/'],
  ['people-pi', '/people/pi/'],
  ['publications', '/publications/'],
  ['publications-before-skku', '/publications/before-skku/'],
  ['publications-non-sci-patents', '/publications/non-sci-patents/'],
  ['news', '/news/'],
  ['gallery', '/gallery/'],
  ['facilities', '/facilities/'],
];

const OUT_DIR = path.resolve('lighthouse-reports');
mkdirSync(OUT_DIR, { recursive: true });

const runOne = (slug, url) =>
  new Promise((resolve, reject) => {
    const out = path.join(OUT_DIR, `${slug}.json`);
    const args = [
      'lighthouse',
      url,
      '--quiet',
      '--output=json',
      `--output-path=${out}`,
      '--only-categories=performance,accessibility,best-practices,seo',
      '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
      '--form-factor=mobile',
      '--throttling-method=simulate',
      '--max-wait-for-load=45000',
    ];
    const proc = spawn('npx', args, { stdio: ['ignore', 'pipe', 'pipe'], shell: true });
    let stderr = '';
    proc.stderr.on('data', (d) => (stderr += d.toString()));
    proc.on('exit', (code) => {
      if (code !== 0 && !existsSync(out)) {
        reject(new Error(`lighthouse failed for ${url} (exit ${code})\n${stderr.slice(-500)}`));
      } else {
        resolve(out);
      }
    });
  });

const fmtScore = (s) => {
  if (s == null) return '  -';
  const n = Math.round(s * 100);
  const pad = String(n).padStart(3, ' ');
  return pad;
};

console.log(`Auditing ${ROUTES.length} routes against ${BASE}\n`);
console.log('route                            perf  a11y  bp   seo  notes');
console.log('───────────────────────────────  ───── ───── ──── ──── ──────────────────────');

const summary = [];
for (const [slug, route] of ROUTES) {
  const url = BASE + route;
  process.stdout.write(`${slug.padEnd(32)} `);
  try {
    const out = await runOne(slug, url);
    const r = JSON.parse(readFileSync(out, 'utf8'));
    const cats = r.categories;
    const audits = r.audits;
    const failedA11y = Object.entries(audits)
      .filter(([id, a]) => id && a.scoreDisplayMode !== 'notApplicable' && a.score === 0 && r.categories.accessibility.auditRefs.some((ref) => ref.id === id))
      .map(([id]) => id);
    process.stdout.write(
      `${fmtScore(cats.performance.score)}   ${fmtScore(cats.accessibility.score)}   ${fmtScore(cats['best-practices'].score)}   ${fmtScore(cats.seo.score)}   ${failedA11y.length} a11y fails\n`,
    );
    summary.push({
      slug,
      perf: cats.performance.score,
      a11y: cats.accessibility.score,
      bp: cats['best-practices'].score,
      seo: cats.seo.score,
      failedA11y,
      lcp: audits['largest-contentful-paint']?.numericValue,
      cls: audits['cumulative-layout-shift']?.numericValue,
      tbt: audits['total-blocking-time']?.numericValue,
    });
  } catch (e) {
    console.log('FAILED');
    console.error(e.message);
  }
}

console.log('\n=== Aggregate failed a11y audits ===');
const allFails = new Map();
for (const s of summary) {
  for (const id of s.failedA11y) {
    if (!allFails.has(id)) allFails.set(id, []);
    allFails.get(id).push(s.slug);
  }
}
for (const [id, slugs] of [...allFails.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${id.padEnd(50)} ${slugs.length} pages: ${slugs.join(', ')}`);
}

console.log('\n=== Web Vitals (mobile, simulated 4G) ===');
console.log('route                            LCP(ms)  CLS    TBT(ms)');
for (const s of summary) {
  console.log(
    `${s.slug.padEnd(32)} ${String(Math.round(s.lcp ?? 0)).padStart(7)}  ${(s.cls ?? 0).toFixed(3)}  ${String(Math.round(s.tbt ?? 0)).padStart(7)}`,
  );
}
