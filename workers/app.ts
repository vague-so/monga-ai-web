import { createRequestHandler } from "react-router";

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
	import.meta.env.MODE
);

const jsonResponse = (data: unknown, status = 200) =>
	Response.json(data, { status });

const ok = (data: unknown) =>
	jsonResponse({ success: true, data });

const fail = (message: string, httpStatus: number, details?: unknown) =>
	jsonResponse({ success: false, message, ...(details !== undefined && { details }) }, httpStatus);

const parseJson = async (request: Request) => {
	try {
		return await request.json();
	} catch {
		throw new Error("INVALID_JSON");
	}
};

const validateImageUrl = (imageUrl?: string) => {
	if (!imageUrl) throw new Error("IMAGE_URL_REQUIRED");
};

const callAIGateway = async (imageUrl: string, env: Env) => {
	const url = `https://gateway.ai.cloudflare.com/v1/${env.CF_ACCOUNT_ID}/${env.CF_AIG_NAME}/fal`;

	const res = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Key ${env.FAL_KEY}`,
			"cf-aig-authorization": `Bearer ${env.CF_AIG_TOKEN}`,
			"Content-Type": "application/json",
			"x-fal-target-url": "https://queue.fal.run/fal-ai/birefnet",
			"x-template-id": "test-remove-bg",
		},
		body: JSON.stringify({ image_url: imageUrl })
	});

	if (!res.ok) {
		const errorText = await res.text();
		let errorDetails: string;

		try {
			const parsed = JSON.parse(errorText);
			errorDetails = parsed.detail ?? parsed.message ?? parsed.error ?? errorText;
		} catch {
			errorDetails = errorText;
		}

		throw { status: res.status, details: errorDetails };
	}

	return res.json();
};

const handleRemoveBg = async (request: Request, env: Env) => {
	try {
		const { imageUrl } = (await parseJson(request)) as { imageUrl?: string };
		validateImageUrl(imageUrl);

		if (!imageUrl) {
			return fail("imageUrl is required", 400);
		}

		const result = await callAIGateway(imageUrl, env);
		return ok(result);
	} catch (err: any) {
		if (err.message === "INVALID_JSON") {
			return fail("Invalid JSON body", 400);
		}

		if (err.message === "IMAGE_URL_REQUIRED") {
			return fail("imageUrl is required", 400);
		}

		if (err.status !== undefined) {
			return fail("fal.ai request failed", err.status, err.details);
		}

		return fail("Unexpected error occurred", 500);
	}
};

export default {
	async fetch(request, env, ctx) {
		const { pathname } = new URL(request.url);

		if (pathname === "/api/test-remove-bg" && request.method === "POST") {
			return handleRemoveBg(request, env);
		}

		return requestHandler(request, {
			cloudflare: { env, ctx }
		});
	}
} satisfies ExportedHandler<Env>;