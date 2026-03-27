import { StatusCodes } from 'http-status-codes';
import { createDb } from '../../db/index';
import { getAllTemplates } from '../../services/template/getAll';
import { listTemplatesSchema } from '../../validators/template';
import { ok, fail } from '../../lib/response';
import { handleError } from '../../lib/handleError';

function validateListTemplatesQuery(request: Request) {
  const url = new URL(request.url);
  const raw = Object.fromEntries(url.searchParams);

  const result = listTemplatesSchema.safeParse(raw);

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

export const listTemplates = async (
  request: Request,
  env: Env,
): Promise<Response> => {
  const { data, error } = validateListTemplatesQuery(request);
  if (error) return error;

  try {
    const db = createDb(env.DATABASE_URL);
    const templates = await getAllTemplates(db, data);
    return ok(templates);
  } catch (err) {
    return handleError(err);
  }
};
