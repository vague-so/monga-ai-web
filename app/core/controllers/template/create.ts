import { createDb } from '../../db/index';
import { createTemplate as createTemplateService } from '../../services/template/create';
import { parseBody } from '../../middlewares/validate';
import { createTemplateSchema } from '../../validators/template';
import { ok } from '../../lib/response';
import { handleError } from '../../lib/handleError';

export const createTemplate = async (
  request: Request,
  env: Env,
): Promise<Response> => {
  const { data, error } = await parseBody(request, createTemplateSchema);
  if (error) return error;

  try {
    const db = createDb(env.DATABASE_URL);
    const created = await createTemplateService(db, data);
    return ok(created);
  } catch (err) {
    return handleError(err);
  }
};
