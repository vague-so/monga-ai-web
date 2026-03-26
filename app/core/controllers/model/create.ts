import { createDb } from "../../db/index";
import { createModel as createModelService } from "../../services/model";
import { parseBody } from "../../middlewares/validate";
import { createModelSchema } from "../../validators/model";
import { ok } from "../../lib/response";
import { handleError } from "../../lib/handleError";

const createModel = async (
	request: Request,
	env: Env,
): Promise<Response> => {
	const { data, error } = await parseBody(request, createModelSchema);
	if (error) return error;

	try {
		const created = await createModelService(createDb(env.DATABASE_URL), {
			providerId: data.providerId,
			modelId: data.modelId,
			displayName: data.displayName,
			type: data.type,
			costPerRun: data.costPerRun,
			isActive: data.isActive ?? true,
			config: data.config ?? null,
		});
		return ok(created);
	} catch (err) {
		return handleError(err);
	}
};


export default createModel;
