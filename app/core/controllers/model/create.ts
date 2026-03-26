import { createDb } from '../../db/index';
import { createModel as createModelService } from '../../services/model';
import { ok } from '../../lib/response';
import { handleError } from '../../lib/handleError';
import type { CreateModelInput } from '../../validators/model';

const createModel = async (data: CreateModelInput, env: Env): Promise<Response> => {
  try {
    const created = await createModelService(createDb(env.DATABASE_URL), {
      providerId: data.providerId,
      modelId: data.modelId,
      displayName: data.displayName,
      type: data.type,
      costPerRun: data.costPerRun,
      isActive: data.isActive ?? true,
      config: data.config ?? null,
    });
    return ok(created);
  } catch (err) {
    return handleError(err);
  }
};

export default createModel;
