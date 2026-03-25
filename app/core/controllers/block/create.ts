import { createDb } from "../../db/index";
import { createBlockDefinition } from "../../services/block/create";
import { parseBody } from "../../middlewares/validate";
import { createBlockSchema } from "../../validators/block";
import { ok } from "../../lib/response";

export const createBlock = async (
	request: Request,
	env: Env,
): Promise<Response> => {
	const { data, error } = await parseBody(request, createBlockSchema);
	if (error) return error;

	const created = await createBlockDefinition(createDb(env.DATABASE_URL), {
		name: data.name,
		model: data.model,
		promptTemplate: data.promptTemplate,
		parameters: data.parameters ?? null,
		type: data.type,
	});

	return ok(created);
};
