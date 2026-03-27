import { z } from 'zod';

const blockStackItemSchema = z.object({
  blockId: z.string().uuid(),
  order: z.number().int().positive(),
  inputMapping: z.record(z.string(), z.any()).default({}),
});

export const createTemplateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  blockStack: z
    .array(blockStackItemSchema)
    .min(1)
    .refine(
      (items) => {
        const orders = items.map((i) => i.order);
        const uniqueOrders = new Set(orders);
        return (
          uniqueOrders.size === items.length &&
          Math.max(...orders) === items.length
        );
      },
      { message: 'Orders must be unique and sequential starting from 1' },
    ),
});

export const updateTemplateSchema = createTemplateSchema
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'At least one field must be provided for update',
  });

export type BlockStackItem = z.infer<typeof blockStackItemSchema>;
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
