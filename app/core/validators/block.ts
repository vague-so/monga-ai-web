import { z } from "zod";

export const createBlockSchema = z.object({
	name: z.string().min(1),
	model: z.string().min(1),
	promptTemplate: z.string().min(1),
	type: z.string().min(1),
	parameters: z.record(z.string(), z.unknown()).nullish(),
});

export const updateBlockSchema = z
	.object({
		name: z.string().min(1).optional(),
		model: z.string().min(1).optional(),
		promptTemplate: z.string().min(1).optional(),
		type: z.string().min(1).optional(),
		parameters: z.record(z.string(), z.unknown()).nullish(),
	})
	.refine(
		(data) =>
			Object.keys(data).some(
				(k) => data[k as keyof typeof data] !== undefined,
			),
		{ message: "No updatable fields provided" },
	);

export type CreateBlockInput = z.infer<typeof createBlockSchema>;
export type UpdateBlockInput = z.infer<typeof updateBlockSchema>;
