import { eq } from "drizzle-orm";
import type { DbClient } from "../../db/index";
import { templates } from "../../schemas";
import type { NewTemplate } from "../../schemas";

export type TemplatePatch = Partial<
	Omit<NewTemplate, "id" | "createdAt" | "updatedAt">
>;

export const updateTemplateRecord = async (
	db: DbClient,
	id: string,
	input: TemplatePatch,
) => {
	const [updated] = await db
		.update(templates)
		.set({ ...input, updatedAt: new Date() })
		.where(eq(templates.id, id))
		.returning();
	return updated ?? null;
};
