import { PipelineTracker } from '../app/core/do/PipelineTracker';
import { handleRoute, createErrorResponse } from './helpers';

export { PipelineTracker };

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    try {
      return await handleRoute(request, env, ctx);
    } catch (error) {
      return createErrorResponse(error);
    }
  },
} satisfies ExportedHandler<Env>;
