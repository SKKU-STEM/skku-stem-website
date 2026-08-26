// 방문자 카운터 — Workers KV에 누적 방문 수를 저장하는 Pages Function
// 바인딩: VISITS (Cloudflare Pages > Settings > Bindings > KV namespace, 변수명 VISITS)
// GET  /api/visits → 현재 값 조회(쓰기 없음)
// POST /api/visits → 1 증가 후 값 반환 (세션당 1회, 클라이언트가 게이팅)

const KEY = 'site-visits';
// CounterAPI v1 종료(410 Gone) 시점까지 집계된 마지막 값. 키가 비어 있을 때만 이 값에서 출발한다.
const SEED = 2379;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function parse(raw) {
  if (raw === null) return SEED;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : SEED;
}

export async function onRequestGet({ env }) {
  if (!env.VISITS) return json({ error: 'KV binding VISITS is not configured' }, 503);
  return json({ count: parse(await env.VISITS.get(KEY)) });
}

export async function onRequestPost({ env }) {
  if (!env.VISITS) return json({ error: 'KV binding VISITS is not configured' }, 503);
  // KV는 read-modify-write라 동시 요청이 겹치면 한 건이 유실될 수 있다. 허영 카운터라 감수한다.
  const next = parse(await env.VISITS.get(KEY)) + 1;
  await env.VISITS.put(KEY, String(next));
  return json({ count: next });
}

export function onRequest() {
  return new Response('Method Not Allowed', {
    status: 405,
    headers: { allow: 'GET, POST' },
  });
}
