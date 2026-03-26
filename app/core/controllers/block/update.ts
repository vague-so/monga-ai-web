import { createDb } from '../../db/index';
import { updateBlock as updateBlockService } from '../../services/block/update';
import { parseBody } from '../../middlewares/validate';
import { updateBlockSchema } from '../../validators/block';
import { ok } from '../../lib/response';
import { handleError } from '../../lib/handleError';
import type { UpdateBlockInput } from '../../validators/block';

export const updateBlock = async (
  request: Request,
  env: Env,
  id: string,
): Promise<Response> => {
  const { data, error } = await parseBody(request, updateBlockSchema);
  if (error) return error;

  try {
    const db = createDb(env.DATABASE_URL);
    const updated = await updateBlockService(db, id, data as UpdateBlockInput);
    return ok(updated);
  } catch (err) {
    return handleError(err);
  }
};
