import { StatusCodes } from "http-status-codes";
import { createDb } from "../../db/index";
import { deleteModel as deleteModelService } from "../../services/model";
import { ok, fail } from "../../lib/response";
import { handleError } from "../../lib/handleError";

const deleteModel = async (
	_request: Request,
	env: Env,
	id: string,
): Promise<Response> => {
	try {
		const deleted = await deleteModelService(createDb(env.DATABASE_URL), id);
		if (!deleted) return fail("Model not found", StatusCodes.NOT_FOUND);
		return ok(deleted);
	} catch (err) {
		return handleError(err);
	}
};

export default deleteModel;
