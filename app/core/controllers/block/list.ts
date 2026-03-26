import { createDb } from "../../db/index";
import { getAllBlockDefinitions } from "../../services/block/getAll";
import { ok } from "../../lib/response";
import { handleError } from "../../lib/handleError";

export const listBlocks = async (
	_request: Request,
	env: Env,
): Promise<Response> => {
	try {
		const data = await getAllBlockDefinitions(createDb(env.DATABASE_URL));
		return ok(data);
	} catch (err) {
		return handleError(err);
	}
};
