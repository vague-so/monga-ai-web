import { handleModelRoutes } from './modelRoutes';
import { handleBlockRoutes } from './blockRoutes';
import { handlePipelineRoutes } from './pipelineRoutes';
import { handleTemplateRoutes } from './templateRoutes';
import { handleGenerationRoutes } from './generationRoutes';
import { handleR2Routes } from './r2Routes';

export const routes = [
  { path: '/api/model', handler: handleModelRoutes },
  { path: '/api/block', handler: handleBlockRoutes },
  { path: '/api/pipeline', handler: handlePipelineRoutes },
  { path: '/api/template', handler: handleTemplateRoutes },
  { path: '/api/generation', handler: handleGenerationRoutes },
  { path: '/r2/', handler: handleR2Routes },
];
