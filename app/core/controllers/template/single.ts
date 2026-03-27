import { createDb } from '@/core/db';
import { singleTemplate as singleTemplateService } from '@/core/services/template/single';
import { handleError } from '@/core/lib/handleError';
import { ok } from '@/core/lib/response';

export const singleTemplate = async (
  request: Request,
  env: Env,
  id: string,
): Promise<Response> => {
  try {
    const db = createDb(env.DATABASE_URL);
    const template = await singleTemplateService(db, id);
    return ok(template);
  } catch (err) {
    return handleError(err);
  }
};
