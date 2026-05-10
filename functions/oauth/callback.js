// Sveltia/Decap CMS OAuth — GitHub code → access_token 교환 + opener에게 postMessage (Cloudflare Pages Function)
// 환경변수: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing ?code', { status: 400 });
  }

  const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenResp.json();
  const ok = !!tokenData.access_token;
  const status = ok ? 'success' : 'error';
  const payload = ok
    ? { token: tokenData.access_token, provider: 'github' }
    : tokenData;

  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;

  // Decap/Sveltia handshake:
  //   popup → opener: 'authorizing:github' (ready)
  //   opener → popup: 'authorizing:github' (ack)
  //   popup → opener: 'authorization:github:<status>:<json>' (credentials)
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Authorizing…</title></head>
<body>
<p>Authorizing with GitHub… You may close this window.</p>
<script>
(function () {
  function send(msg) {
    if (window.opener) window.opener.postMessage(msg, '*');
  }
  function receive(e) {
    if (e.data === 'authorizing:github') {
      send(${JSON.stringify(message)});
    }
  }
  window.addEventListener('message', receive);
  send('authorizing:github');
}());
</script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
