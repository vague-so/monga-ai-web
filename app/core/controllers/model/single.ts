import { createDb } from "../../db/index";
import { singleModel as singleModelService } from "../../services/model";
import { ok } from "../../lib/response";
import { handleError } from "../../lib/handleError";

const singleModel = async (
	_request: Request,
	env: Env,
	id: string,
): Promise<Response> => {
	try {
		const model = await singleModelService(createDb(env.DATABASE_URL), id);
		return ok(model);
	} catch (err) {
		return handleError(err);
	}
};

export default singleModel;
