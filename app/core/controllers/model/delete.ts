import { StatusCodes } from 'http-status-codes';
import { createDb } from '../../db/index';
import { deleteModel as deleteModelService } from '../../services/model/delete';
import { ok, fail } from '../../lib/response';
import { handleError } from '../../lib/handleError';

export const deleteModel = async (
  _request: Request,
  env: Env,
  id: string,
): Promise<Response> => {
  try {
    const db = createDb(env.DATABASE_URL);
    const deleted = await deleteModelService(db, id);
    return ok(deleted);
  } catch (err) {
    return handleError(err);
  }
};
