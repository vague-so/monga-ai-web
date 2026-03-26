import { createRequestHandler } from 'react-router';
import { routes } from '../app/core/routes';

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
);

const matchApiRoute = (pathname: string) =>
  routes.find((r) => pathname.startsWith(r.path));

export async function handleRoute(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
) {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith('/api/')) {
    const route = matchApiRoute(pathname);

    if (route) {
      const res = await route.handler(request, env);
      if (res) return res;
    }

    return new Response(
      JSON.stringify({ success: false, message: 'API route not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return requestHandler(request, { cloudflare: { env, ctx } });
}

export const createErrorResponse = (error: unknown) =>
  new Response(
    JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    }),
    { status: 500, headers: { 'Content-Type': 'application/json' } },
  );
