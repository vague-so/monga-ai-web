import { StatusCodes } from "http-status-codes";
import { createDb } from "../../db/index";
import { updateModel as updateModelService } from "../../services/model";
import { parseBody } from "../../middlewares/validate";
import { updateModelSchema } from "../../validators/model";
import { ok, fail } from "../../lib/response";
import { handleError } from "../../lib/handleError";

const updateModel = async (
	request: Request,
	env: Env,
	id: string,
): Promise<Response> => {
	const { data, error } = await parseBody(request, updateModelSchema);
	if (error) return error;

	try {
		const updated = await updateModelService(createDb(env.DATABASE_URL), id, data);
		if (!updated) return fail("Model not found", StatusCodes.NOT_FOUND);
		return ok(updated);
	} catch (err) {
		return handleError(err);
	}
};

export default updateModel;
