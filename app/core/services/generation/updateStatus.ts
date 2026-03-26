import { eq } from "drizzle-orm";
import type { DbClient } from "../../db/index";
import { generations } from "../../schemas";
import type { GenerationStatus } from "../../schemas";

export interface BlockResult {
	blockId: string;
	status: GenerationStatus;
	outputUrl?: string;
	providerJobId?: string;
	cost?: number;
	errorMessage?: string;
}

export interface StatusUpdate {
	status: GenerationStatus;
	outputUrl?: string;
	providerCost?: number;
	errorMessage?: string;
	blockResults?: BlockResult[];
}

export const updateGenerationStatus = async (
	db: DbClient,
	id: string,
	update: StatusUpdate,
) => {
	const now = new Date();
	const timestamps =
		update.status === "processing"
			? { startedAt: now }
			: update.status === "completed" || update.status === "failed"
				? { completedAt: now }
				: {};

	const [updated] = await db
		.update(generations)
		.set({ ...update, ...timestamps })
		.where(eq(generations.id, id))
		.returning();
	return updated ?? null;
};
