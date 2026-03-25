import { createDb } from "../../db/index";
import { deleteBlockDefinition } from "../../services/block/delete";
import { ok, fail } from "../../lib/response";

export const deleteBlock = async (
	_request: Request,
	env: Env,
	id: string,
): Promise<Response> => {
	const deleted = await deleteBlockDefinition(createDb(env.DATABASE_URL), id);
	if (!deleted) return fail("Block definition not found", 404);
	return ok(deleted);
};
