import { createTemplate } from '../controllers/template/create';
import { listTemplates } from '../controllers/template/list';
import { updateTemplate } from '../controllers/template/update';
import { deleteTemplate } from '../controllers/template/delete';

const TEMPLATE_ID_RE = /^\/api\/template\/([0-9a-f-]{36})$/;

export const handleTemplateRoutes = async (
  request: Request,
  env: Env,
): Promise<Response | null> => {
  const { pathname } = new URL(request.url);
  const method = request.method;

  if (pathname === '/api/template' && method === 'POST') {
    return createTemplate(request, env);
  }

  if (pathname === '/api/template' && method === 'GET') {
    return listTemplates(request, env);
  }

  const match = pathname.match(TEMPLATE_ID_RE);
  if (match) {
    const [, id] = match;
    // if (method === 'GET') return singleTemplate(request, env, id);
    if (method === 'PATCH') return updateTemplate(request, env, id);
    if (method === 'DELETE') return deleteTemplate(request, env, id);
  }

  return null;
};
