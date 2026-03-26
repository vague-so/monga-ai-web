import { createDb } from '../../db/index';
import { createModel as createModelService } from '../../services/model/create';
import { parseBody } from '../../middlewares/validate';
import { createModelSchema } from '../../validators/model';
import { ok } from '../../lib/response';
import { handleError } from '../../lib/handleError';

export const createModel = async (
  request: Request,
  env: Env,
): Promise<Response> => {
  const { data, error } = await parseBody(request, createModelSchema);
  if (error) return error;

  try {
    const db = createDb(env.DATABASE_URL);
    const created = await createModelService(db, data);
    return ok(created);
  } catch (err) {
    return handleError(err);
  }
};
