import { listGenerations } from "../controllers/generation/list";
import { createGeneration } from "../controllers/generation/create";
import { getGeneration } from "../controllers/generation/getById";

const GENERATION_ID_RE = /^\/api\/generation\/([0-9a-f-]{36})$/;

export const handleGenerationRoutes = async (
	request: Request,
	env: Env,
): Promise<Response | null> => {
	const { pathname } = new URL(request.url);
	const method = request.method;

	if (pathname === "/api/generation/list" && method === "GET") {
		return listGenerations(request, env);
	}

	if (pathname === "/api/generation/create" && method === "POST") {
		return createGeneration(request, env);
	}

	const match = pathname.match(GENERATION_ID_RE);
	if (match) {
		const [, id] = match;
		if (method === "GET") return getGeneration(request, env, id);
	}

	return null;
};
