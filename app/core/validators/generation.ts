import { z } from "zod";

export const createGenerationSchema = z.object({
	templateId: z.string().uuid(),
	inputParams: z.record(z.string(), z.unknown()),
});

export const listGenerationsSchema = z.object({
	status: z
		.enum(["queued", "processing", "completed", "failed"])
		.optional(),
	limit: z.coerce.number().int().positive().max(100).default(50),
	offset: z.coerce.number().int().nonnegative().default(0),
});

export type CreateGenerationInput = z.infer<typeof createGenerationSchema>;
export type ListGenerationsInput = z.infer<typeof listGenerationsSchema>;
