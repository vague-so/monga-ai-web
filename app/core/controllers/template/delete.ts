import { createDb } from "../../db/index";
import { deleteTemplateRecord } from "../../services/template/delete";
import { ok, fail } from "../../lib/response";

export const deleteTemplate = async (
	_request: Request,
	env: Env,
	id: string,
): Promise<Response> => {
	const deleted = await deleteTemplateRecord(createDb(env.DATABASE_URL), id);
	if (!deleted) return fail("Template not found", 404);
	return ok(deleted);
};
