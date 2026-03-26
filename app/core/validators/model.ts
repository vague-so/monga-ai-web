import { z } from "zod";

export const createModelSchema = z.object({
	providerId: z.string().min(1),
	modelId: z.string().min(1),
	displayName: z.string().min(1),
	type: z.string().min(1),
	costPerRun: z.number().int().nonnegative(),
	isActive: z.boolean().optional(),
	config: z.record(z.string(), z.unknown()).nullish(),
});

export const updateModelSchema = z
	.object({
		displayName: z.string().min(1).optional(),
		type: z.string().min(1).optional(),
		costPerRun: z.number().int().nonnegative().optional(),
		isActive: z.boolean().optional(),
		config: z.record(z.string(), z.unknown()).nullish(),
	})
	.refine(
		(data) => Object.values(data).some((v) => v !== undefined),
		{ message: "No updatable fields provided" },
	);

export const listModelsSchema = z.object({
	limit: z.coerce.number().int().min(1).max(100).optional().default(20),
	offset: z.coerce.number().int().min(0).optional().default(0),
	isActive: z
		.enum(["true", "false"])
		.transform((v) => v === "true")
		.optional(),
	type: z.string().optional(),
});

export type CreateModelInput = z.infer<typeof createModelSchema>;
export type UpdateModelInput = z.infer<typeof updateModelSchema>;
export type ListModelsInput = z.infer<typeof listModelsSchema>;
