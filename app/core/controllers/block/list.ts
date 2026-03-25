import { createDb } from "../../db/index";
import { getAllBlockDefinitions } from "../../services/block/getAll";
import { ok } from "../../lib/response";

export const listBlocks = async (
	_request: Request,
	env: Env,
): Promise<Response> => {
	const data = await getAllBlockDefinitions(createDb(env.DATABASE_URL));
	return ok(data);
};
