import { z } from "zod";

const blockStackItemSchema = z.object({
	blockId: z.string().uuid(),
	position: z.number().int().nonnegative(),
	overrides: z.record(z.string(), z.unknown()).default({}),
});

export const createTemplateSchema = z.object({
	title: z.string().min(1),
	blockStack: z.array(blockStackItemSchema).min(1),
});

export const updateTemplateSchema = z
	.object({
		title: z.string().min(1).optional(),
		blockStack: z.array(blockStackItemSchema).optional(),
	})
	.refine(
		(data) => Object.values(data).some((v) => v !== undefined),
		{ message: "No updatable fields provided" },
	);

export type BlockStackItem = z.infer<typeof blockStackItemSchema>;
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
