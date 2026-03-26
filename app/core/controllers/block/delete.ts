import { StatusCodes } from "http-status-codes";
import { createDb } from "../../db/index";
import { deleteBlockDefinition } from "../../services/block/delete";
import { ok, fail } from "../../lib/response";
import { handleError } from "../../lib/handleError";

export const deleteBlock = async (
	_request: Request,
	env: Env,
	id: string,
): Promise<Response> => {
	try {
		const deleted = await deleteBlockDefinition(createDb(env.DATABASE_URL), id);
		if (!deleted) return fail("Block not found", StatusCodes.NOT_FOUND);
		return ok(deleted);
	} catch (err) {
		return handleError(err);
	}
};
