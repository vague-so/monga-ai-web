import { createDb } from '../../db/index';
import { singleBlock as singleBlockService } from '../../services/block/single';
import { ok } from '../../lib/response';
import { handleError } from '../../lib/handleError';

export const singleBlock = async (
  _request: Request,
  env: Env,
  id: string,
): Promise<Response> => {
  try {
    const db = createDb(env.DATABASE_URL);
    const block = await singleBlockService(db, id);
    return ok(block);
  } catch (err) {
    return handleError(err);
  }
};
