import { createRequestHandler } from 'react-router';
import { routes } from '../app/core/routes';

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
);

function matchRoute(pathname: string) {
  return routes.find((route) => pathname.startsWith(route.path));
}

export async function handleRoute(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
) {
  const { pathname } = new URL(request.url);

  const route = matchRoute(pathname);

  if (route) {
    const res = await route.handler(request, env);
    if (res) return res;
  }

  return requestHandler(request, { cloudflare: { env, ctx } });
}

export function createErrorResponse(error: unknown) {
  return new Response(
    JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}
