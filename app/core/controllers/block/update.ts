import { StatusCodes } from "http-status-codes";
import { createDb } from "../../db/index";
import { updateBlockDefinition } from "../../services/block/update";
import { parseBody } from "../../middlewares/validate";
import { updateBlockSchema } from "../../validators/block";
import { ok, fail } from "../../lib/response";
import { handleError } from "../../lib/handleError";

export const updateBlock = async (
	request: Request,
	env: Env,
	id: string,
): Promise<Response> => {
	const { data, error } = await parseBody(request, updateBlockSchema);
	if (error) return error;

	try {
		const updated = await updateBlockDefinition(createDb(env.DATABASE_URL), id, data);
		if (!updated) return fail("Block not found", StatusCodes.NOT_FOUND);
		return ok(updated);
	} catch (err) {
		return handleError(err);
	}
};
