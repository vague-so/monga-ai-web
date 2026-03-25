import { createDb } from "../../db/index";
import { getAllTemplates } from "../../services/template/getAll";
import { ok } from "../../lib/response";

export const listTemplates = async (
	_request: Request,
	env: Env,
): Promise<Response> => {
	const data = await getAllTemplates(createDb(env.DATABASE_URL));
	return ok(data);
};
