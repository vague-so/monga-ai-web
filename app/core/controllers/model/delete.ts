import { StatusCodes } from "http-status-codes";
import { createDb } from "../../db/index";
import { deleteModelRecord } from "../../services/model/delete";
import { ok, fail } from "../../lib/response";
import { handleError } from "../../lib/handleError";

export const deleteModel = async (
	_request: Request,
	env: Env,
	id: string,
): Promise<Response> => {
	try {
		const deleted = await deleteModelRecord(createDb(env.DATABASE_URL), id);
		if (!deleted) return fail("Model not found", StatusCodes.NOT_FOUND);
		return ok(deleted);
	} catch (err) {
		return handleError(err);
	}
};
