import { createDb } from "../../db/index";
import { insertModel } from "../../services/model/create";
import { parseBody } from "../../middlewares/validate";
import { createModelSchema } from "../../validators/model";
import { ok } from "../../lib/response";

export const createModel = async (
	request: Request,
	env: Env,
): Promise<Response> => {
	const { data, error } = await parseBody(request, createModelSchema);
	if (error) return error;

	const created = await insertModel(createDb(env.DATABASE_URL), {
		providerId: data.providerId,
		modelId: data.modelId,
		displayName: data.displayName,
		type: data.type,
		costPerRun: data.costPerRun,
		isActive: data.isActive ?? true,
		config: data.config ?? null,
	});

	return ok(created);
};
