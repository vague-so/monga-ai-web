import { z } from 'zod';

export const createBlockSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  modelId: z.string().uuid(),
  defaults: z.record(z.string(), z.unknown()).optional().default({}),
});

export const updateBlockSchema = z
  .object({
    name: z.string().min(1).optional(),
    type: z.string().min(1).optional(),
    modelId: z.string().uuid().optional(),
    defaults: z.record(z.string(), z.unknown()).optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'No updatable fields provided',
  });

export const listBlocksSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  type: z.string().optional(),
  modelId: z.string().uuid().optional(),
});

export type CreateBlockInput = z.infer<typeof createBlockSchema>;
export type UpdateBlockInput = z.infer<typeof updateBlockSchema>;
export type ListBlocksInput = z.infer<typeof listBlocksSchema>;
