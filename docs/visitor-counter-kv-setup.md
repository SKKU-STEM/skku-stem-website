# 방문자 카운터 — Cloudflare KV 설정 (2026-08-26)

## 배경

기존 카운터는 서드파티 `api.counterapi.dev/v1` 을 호출했는데, 이 API가 서비스 종료되어
모든 요청이 `410 Gone` 을 반환하게 됐다. 클라이언트가 실패를 조용히 삼키고 있어서
`localStorage` 에 캐시된 마지막 성공값(2379)이 그대로 계속 표시됐다. 캐시가 없는
신규 방문자에게는 `– – – – –` 만 보였다. v2 워크스페이스로 이관되지 않아
(`404 Workspace not found`) 누적값은 CounterAPI 쪽에서 복구 불가능했다.

그래서 이미 쓰고 있던 Cloudflare Pages Functions 위에 자체 카운터를 얹었다.

## 코드

- `functions/api/visits.js` — `GET /api/visits` 조회, `POST /api/visits` 1 증가
- `src/components/VisitorCounter.astro` — 세션 첫 방문은 POST, 이후 페이지 이동은 GET

KV 키는 `site-visits` 하나뿐이다. 키가 비어 있으면 `SEED = 2379`(v1 마지막 집계값)
에서 출발하므로, 기존에 보이던 숫자에서 자연스럽게 이어진다.

## 대시보드 설정 (1회, 사용자 작업)

1. Cloudflare 대시보드 → **Storage & Databases → KV** → **Create instance**
   - 이름은 아무거나. 예: `skku-stem-visits`
2. **Workers & Pages → skkustem(Pages 프로젝트) → Settings → Bindings**
   - **Add → KV namespace**
   - **Variable name**: `VISITS` ← 반드시 이 이름. 코드가 `env.VISITS` 로 읽는다.
   - **KV namespace**: 1번에서 만든 것 선택
   - **Production** 과 **Preview** 둘 다 추가
3. 저장 후 재배포(다음 push 또는 Deployments → Retry deployment)

## 검증

```bash
curl -s https://skkustem.org/api/visits            # {"count":2379}
curl -s -X POST https://skkustem.org/api/visits    # {"count":2380}
```

바인딩이 없으면 `503 {"error":"KV binding VISITS is not configured"}` 가 나온다.
브라우저 콘솔에도 `[visitor-counter] /api/visits responded 503` 이 남는다.

## 한계

- **동시 쓰기 유실**: KV는 read-modify-write라 같은 순간에 두 방문자가 들어오면
  한 건이 유실될 수 있다. 허영 카운터라 감수한다. 정확한 통계는 Cloudflare Web Analytics.
- **무료 한도**: KV 쓰기 1,000/일, 읽기 100,000/일. 쓰기는 세션당 1회라 여유롭다.
- **집계 단위**: 브라우저 세션당 1회. 순 방문자수가 아니라 세션 수에 가깝다.
