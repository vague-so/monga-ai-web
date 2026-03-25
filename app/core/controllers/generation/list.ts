import { createDb } from "../../db/index";
import { getGenerations } from "../../services/generation/list";
import { listGenerationsSchema } from "../../validators/generation";
import { ok, fail } from "../../lib/response";
import type { GenerationStatus } from "../../schemas";

export const listGenerations = async (
	request: Request,
	env: Env,
): Promise<Response> => {
	const url = new URL(request.url);
	const raw = Object.fromEntries(url.searchParams);

	const result = listGenerationsSchema.safeParse(raw);
	if (!result.success) {
		return fail(
			"Invalid query params",
			422,
			result.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
		);
	}

	const { status, limit, offset } = result.data;
	const data = await getGenerations(createDb(env.DATABASE_URL), {
		status: status as GenerationStatus | undefined,
		limit,
		offset,
	});
	return ok(data);
};
