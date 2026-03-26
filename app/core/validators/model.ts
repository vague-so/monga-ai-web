import { z } from 'zod';

const parameterSchema = z.object({
  type: z.enum(['text', 'number', 'boolean', 'enum']),
  label: z.string().min(1),
  required: z.boolean(),
  default: z.any().optional(),
  options: z.array(z.string()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});

const configSchema = z.object({
  api_path: z.string().min(1),
  parameters: z.record(z.string(), parameterSchema),
});

export const createModelSchema = z.object({
  providerId: z.string().min(1),
  modelId: z.string().min(1),
  displayName: z.string().min(1),
  type: z.string().min(1),
  costPerRun: z.number().int().nonnegative(),
  isActive: z.boolean().default(true),
  config: configSchema,
});

export const updateModelSchema = z
  .object({
    displayName: z.string().min(1).optional(),
    type: z.string().min(1).optional(),
    costPerRun: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
    config: configSchema.optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'No updatable fields provided',
  });

export const listModelsSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  isActive: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  type: z.string().optional(),
});

export type CreateModelInput = z.infer<typeof createModelSchema>;
export type UpdateModelInput = z.infer<typeof updateModelSchema>;
export type ListModelsInput = z.infer<typeof listModelsSchema>;
