import { createDb } from '../../db/index';
import { createBlock as createBlockService } from '../../services/block/create';
import { parseBody } from '../../middlewares/validate';
import { createBlockSchema } from '../../validators/block';
import { ok } from '../../lib/response';
import { handleError } from '../../lib/handleError';

export const createBlock = async (
  request: Request,
  env: Env,
): Promise<Response> => {
  const { data, error } = await parseBody(request, createBlockSchema);
  if (error) return error;

  try {
    const db = createDb(env.DATABASE_URL);
    const created = await createBlockService(db, data);
    return ok(created);
  } catch (err) {
    return handleError(err);
  }
};
