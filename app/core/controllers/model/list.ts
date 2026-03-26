import { StatusCodes } from "http-status-codes";
import { createDb } from "../../db/index";
import { listModels as listModelsService } from "../../services/model";
import { listModelsSchema } from "../../validators/model";
import { ok, fail } from "../../lib/response";
import { handleError } from "../../lib/handleError";

const listModels = async (
	request: Request,
	env: Env,
): Promise<Response> => {
	const url = new URL(request.url);
	const raw = Object.fromEntries(url.searchParams);

	const result = listModelsSchema.safeParse(raw);
	if (!result.success) {
		return fail(
			"Invalid query params",
			StatusCodes.UNPROCESSABLE_ENTITY,
			result.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
		);
	}

	try {
		const data = await listModelsService(createDb(env.DATABASE_URL), result.data);
		return ok(data);
	} catch (err) {
		return handleError(err);
	}
};

export default listModels;
