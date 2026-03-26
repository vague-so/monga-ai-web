import { createModel } from '../controllers/model/create';
import { listModels } from '../controllers/model/list';
import { singleModel } from '../controllers/model/single';
import { updateModel } from '../controllers/model/update';
import { deleteModel } from '../controllers/model/delete';

const MODEL_ID_RE = /^\/api\/model\/([0-9a-f-]{36})$/;

export const handleModelRoutes = async (
  request: Request,
  env: Env,
): Promise<Response | null> => {
  const { pathname } = new URL(request.url);
  const method = request.method;

  if (pathname === '/api/model' && method === 'POST') {
    return createModel(request, env);
  }

  if (pathname === '/api/model' && method === 'GET') {
    return listModels(request, env);
  }

  const match = pathname.match(MODEL_ID_RE);
  if (match) {
    const id = match[1];
    if (method === 'GET') return singleModel(request, env, id);
    if (method === 'PATCH') return updateModel(request, env, id);
    if (method === 'DELETE') return deleteModel(request, env, id);
  }

  return null;
};
