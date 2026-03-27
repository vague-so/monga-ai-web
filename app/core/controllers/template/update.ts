import { createDb } from '../../db/index';
import { updateTemplate as updateTemplateService } from '../../services/template/update';
import { parseBody } from '../../middlewares/validate';
import { updateTemplateSchema } from '../../validators/template';
import { ok } from '../../lib/response';
import { handleError } from '../../lib/handleError';

export const updateTemplate = async (
  request: Request,
  env: Env,
  id: string,
): Promise<Response> => {
  const { data, error } = await parseBody(request, updateTemplateSchema);
  if (error) return error;

  try {
    const db = createDb(env.DATABASE_URL);
    const updated = await updateTemplateService(db, id, data);
    return ok(updated);
  } catch (err) {
    return handleError(err);
  }
};
