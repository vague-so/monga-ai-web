import { createBlock } from '../controllers/block/create';
import { listBlocks } from '../controllers/block/list';
import { singleBlock } from '../controllers/block/single';
import { updateBlock } from '../controllers/block/update';
import { deleteBlock } from '../controllers/block/delete';

const BLOCK_ID_RE = /^\/api\/block\/([0-9a-f-]{36})$/;

export const handleBlockRoutes = async (
  request: Request,
  env: Env,
): Promise<Response | null> => {
  const { pathname } = new URL(request.url);
  const method = request.method;

  if (pathname === '/api/block' && method === 'POST') {
    return createBlock(request, env);
  }

  if (pathname === '/api/block' && method === 'GET') {
    return listBlocks(request, env);
  }

  const match = pathname.match(BLOCK_ID_RE);
  if (match) {
    const [, id] = match;
    if (method === 'GET') return singleBlock(request, env, id);
    if (method === 'PATCH') return updateBlock(request, env, id);
    if (method === 'DELETE') return deleteBlock(request, env, id);
  }

  return null;
};
