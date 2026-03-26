import { createRequestHandler } from "react-router";

import { PipelineTracker } from "../app/core/do/PipelineTracker";
import { handleBlockRoutes } from "../app/core/routes/blockRoutes";
import { handlePipelineRoutes } from "../app/core/routes/pipelineRoutes";
import { handleModelRoutes } from "../app/core/routes/modelRoutes";
import { handleTemplateRoutes } from "../app/core/routes/templateRoutes";
import { handleGenerationRoutes } from "../app/core/routes/generationRoutes";
import { handleR2Routes } from "../app/core/routes/r2Routes";

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

export default {
	async fetch(request, env, ctx) {
		const { pathname } = new URL(request.url);

		if (pathname.startsWith("/api/block")) {
			const res = await handleBlockRoutes(request, env);
			if (res) return res;
		}

		if (pathname.startsWith("/api/pipeline")) {
			const res = await handlePipelineRoutes(request, env);
			if (res) return res;
		}

		if (pathname.startsWith("/api/model")) {
			const res = await handleModelRoutes(request, env);
			if (res) return res;
		}

		if (pathname.startsWith("/api/template")) {
			const res = await handleTemplateRoutes(request, env);
			if (res) return res;
		}

		if (pathname.startsWith("/api/generation")) {
			const res = await handleGenerationRoutes(request, env);
			if (res) return res;
		}

		if (pathname.startsWith("/r2/")) {
			const res = await handleR2Routes(request, env);
			if (res) return res;
		}

		return requestHandler(request, {
			cloudflare: { env, ctx },
		});
	},
} satisfies ExportedHandler<Env>;
