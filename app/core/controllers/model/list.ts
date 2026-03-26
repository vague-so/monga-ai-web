import { StatusCodes } from 'http-status-codes';
import { createDb } from '../../db/index';
import { listModels as listModelsService } from '../../services/model/list';
import { listModelsSchema } from '../../validators/model';
import { ok, fail } from '../../lib/response';
import { handleError } from '../../lib/handleError';

function validateListModelsQuery(request: Request) {
  const url = new URL(request.url);
  const raw = Object.fromEntries(url.searchParams);

  const result = listModelsSchema.safeParse(raw);

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

export const listModels = async (
  request: Request,
  env: Env,
): Promise<Response> => {
  const { data, error } = validateListModelsQuery(request);
  if (error) return error;

  try {
    const db = createDb(env.DATABASE_URL);
    const models = await listModelsService(db, data);
    return ok(models);
  } catch (err) {
    return handleError(err);
  }
};
