import { StatusCodes } from 'http-status-codes';
import { createDb } from '../../db/index';
import { listBlocks as listBlocksService } from '../../services/block/list';
import { listBlocksSchema } from '../../validators/block';
import { ok, fail } from '../../lib/response';
import { handleError } from '../../lib/handleError';

function validateListBlocksQuery(request: Request) {
  const url = new URL(request.url);
  const raw = Object.fromEntries(url.searchParams);

  const result = listBlocksSchema.safeParse(raw);

  if (!result.success) {
    return {
      data: null,
      error: fail(
        'Invalid query params',
        StatusCodes.UNPROCESSABLE_ENTITY,
        result.error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      ),
    };
  }

  return { data: result.data, error: null };
}

export const listBlocks = async (
  request: Request,
  env: Env,
): Promise<Response> => {
  const { data, error } = validateListBlocksQuery(request);
  if (error) return error;

  try {
    const db = createDb(env.DATABASE_URL);
    const blocks = await listBlocksService(db, data);
    return ok(blocks);
  } catch (err) {
    return handleError(err);
  }
};
