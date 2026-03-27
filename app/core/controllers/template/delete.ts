import { createDb } from '../../db/index';
import { deleteTemplate as deleteTemplateService } from '../../services/template/delete';
import { ok } from '../../lib/response';
import { handleError } from '../../lib/handleError';

export const deleteTemplate = async (
  _request: Request,
  env: Env,
  id: string,
): Promise<Response> => {
  try {
    const db = createDb(env.DATABASE_URL);
    const deleted = await deleteTemplateService(db, id);
    return ok(deleted);
  } catch (err) {
    return handleError(err);
  }
};
