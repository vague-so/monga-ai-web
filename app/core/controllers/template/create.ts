import { createDb } from "../../db/index";
import { insertTemplate } from "../../services/template/create";
import { parseBody } from "../../middlewares/validate";
import { createTemplateSchema } from "../../validators/template";
import { ok } from "../../lib/response";
import { handleError } from "../../lib/handleError";

export const createTemplate = async (
	request: Request,
	env: Env,
): Promise<Response> => {
	const { data, error } = await parseBody(request, createTemplateSchema);
	if (error) return error;

	try {
		const created = await insertTemplate(createDb(env.DATABASE_URL), {
			title: data.title,
			blockStack: data.blockStack,
		});
		return ok(created);
	} catch (err) {
		return handleError(err);
	}
};
