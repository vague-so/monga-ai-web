import { createDb } from '../../db/index';
import { singleModel as singleModelService } from '../../services/model/single';
import { ok } from '../../lib/response';
import { handleError } from '../../lib/handleError';

export const singleModel = async (
  _request: Request,
  env: Env,
  id: string,
): Promise<Response> => {
  try {
    const db = createDb(env.DATABASE_URL);
    const model = await singleModelService(db, id);
    return ok(model);
  } catch (err) {
    return handleError(err);
  }
};
