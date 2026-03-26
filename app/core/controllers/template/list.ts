import { createDb } from "../../db/index";
import { getAllTemplates } from "../../services/template/getAll";
import { ok } from "../../lib/response";
import { handleError } from "../../lib/handleError";

export const listTemplates = async (
	_request: Request,
	env: Env,
): Promise<Response> => {
	try {
		const data = await getAllTemplates(createDb(env.DATABASE_URL));
		return ok(data);
	} catch (err) {
		return handleError(err);
	}
};
