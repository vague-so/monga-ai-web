import { executePipeline } from "../controllers/pipeline/execute";

export const handlePipelineRoutes = async (
	request: Request,
	env: Env,
): Promise<Response | null> => {
	const { pathname } = new URL(request.url);
	const method = request.method;

	if (pathname === "/api/pipeline/execute" && method === "POST") {
		return executePipeline(request, env);
	}

	return null;
};
