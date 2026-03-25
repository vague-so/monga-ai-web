import { createDb } from "../../db/index";
import { deleteModelRecord } from "../../services/model/delete";
import { ok, fail } from "../../lib/response";

export const deleteModel = async (
	_request: Request,
	env: Env,
	id: string,
): Promise<Response> => {
	const deleted = await deleteModelRecord(createDb(env.DATABASE_URL), id);
	if (!deleted) return fail("Model not found", 404);
	return ok(deleted);
};
