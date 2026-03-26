import { StatusCodes } from "http-status-codes";
import { createDb } from "../../db/index";
import { updateTemplateRecord } from "../../services/template/update";
import { parseBody } from "../../middlewares/validate";
import { updateTemplateSchema } from "../../validators/template";
import { ok, fail } from "../../lib/response";
import { handleError } from "../../lib/handleError";

export const updateTemplate = async (
	request: Request,
	env: Env,
	id: string,
): Promise<Response> => {
	const { data, error } = await parseBody(request, updateTemplateSchema);
	if (error) return error;

	try {
		const updated = await updateTemplateRecord(createDb(env.DATABASE_URL), id, data);
		if (!updated) return fail("Template not found", StatusCodes.NOT_FOUND);
		return ok(updated);
	} catch (err) {
		return handleError(err);
	}
};
