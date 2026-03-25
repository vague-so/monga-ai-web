import { createDb } from "../../db/index";
import { updateModelRecord } from "../../services/model/update";
import { parseBody } from "../../middlewares/validate";
import { updateModelSchema } from "../../validators/model";
import { ok, fail } from "../../lib/response";

export const updateModel = async (
	request: Request,
	env: Env,
	id: string,
): Promise<Response> => {
	const { data, error } = await parseBody(request, updateModelSchema);
	if (error) return error;

	const updated = await updateModelRecord(createDb(env.DATABASE_URL), id, data);
	if (!updated) return fail("Model not found", 404);
	return ok(updated);
};
