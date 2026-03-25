import { createDb } from "../../db/index";
import { getTemplateById } from "../../services/template/getById";
import { insertGeneration } from "../../services/generation/create";
import { parseBody } from "../../middlewares/validate";
import { createGenerationSchema } from "../../validators/generation";
import { ok, fail } from "../../lib/response";

export const createGeneration = async (
	request: Request,
	env: Env,
): Promise<Response> => {
	const { data, error } = await parseBody(request, createGenerationSchema);
	if (error) return error;

	const db = createDb(env.DATABASE_URL);

	const template = await getTemplateById(db, data.templateId);
	if (!template) return fail("Template not found", 404);

	const generation = await insertGeneration(db, {
		templateId: data.templateId,
		inputParams: data.inputParams,
	});

	return ok(generation);
};
