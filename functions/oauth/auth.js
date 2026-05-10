// Sveltia/Decap CMS OAuth — GitHub authorize 리다이렉트 (Cloudflare Pages Function)
// 환경변수: GITHUB_CLIENT_ID (Cloudflare Pages 대시보드 > Settings > Environment variables)

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const clientId = env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response('Missing GITHUB_CLIENT_ID env', { status: 500 });
  }

  const scope = url.searchParams.get('scope') || 'repo,user';
  const state = crypto.randomUUID();

  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('scope', scope);
  authorize.searchParams.set('state', state);
  authorize.searchParams.set('redirect_uri', `${url.origin}/oauth/callback`);

  return Response.redirect(authorize.toString(), 302);
}
