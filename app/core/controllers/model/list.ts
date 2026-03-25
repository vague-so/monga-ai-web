import { createDb } from "../../db/index";
import { getAllModels } from "../../services/model/getAll";
import { ok } from "../../lib/response";

export const listModels = async (
	_request: Request,
	env: Env,
): Promise<Response> => {
	const data = await getAllModels(createDb(env.DATABASE_URL));
	return ok(data);
};
