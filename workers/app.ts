import { createRequestHandler } from "react-router";

import { PipelineTracker } from "../app/core/do/PipelineTracker";
import { routes } from "../app/core/routes";

export { PipelineTracker };

declare module "react-router" {
	export interface AppLoadContext {
		cloudflare: {
			env: Env;
			ctx: ExecutionContext;
		};
	}
}

const requestHandler = createRequestHandler(
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

const matchRoute = (pathname: string) =>
	routes.find((route) => pathname.startsWith(route.path));

export default {
	async fetch(request, env, ctx) {
		try {
			const { pathname } = new URL(request.url);

			const route = matchRoute(pathname);

			if (route) {
				const res = await route.handler(request, env);
				if (res) return res;
			}

			return requestHandler(request, {
				cloudflare: { env, ctx },
			});
		} catch (error) {
			return new Response(
				JSON.stringify({
					success: false,
					message:
						error instanceof Error
							? error.message
							: "Internal server error",
				}),
				{
					status: 500,
					headers: { "Content-Type": "application/json" },
				}
			);
		}
	},
} satisfies ExportedHandler<Env>;
