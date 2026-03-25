import { DurableObject } from "cloudflare:workers";

export interface BlockRow {
	id: number;
	jobId: string;
	blockType: string;
	status: string;
	inputUrl: string;
	outputUrl: string;
	metadata: string;
	createdAt: string;
	[key: string]: SqlStorageValue;
}

export interface PushBlockInput {
	jobId: string;
	blockType: string;
	status: string;
	inputUrl: string;
	outputUrl: string;
	metadata: Record<string, unknown>;
}

export class PipelineTracker extends DurableObject<Env> {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		ctx.blockConcurrencyWhile(async () => {
			this.ctx.storage.sql.exec(`
				CREATE TABLE IF NOT EXISTS blocks (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					jobId TEXT NOT NULL,
					blockType TEXT NOT NULL,
					status TEXT NOT NULL,
					inputUrl TEXT NOT NULL,
					outputUrl TEXT NOT NULL,
					metadata TEXT NOT NULL,
					createdAt TEXT NOT NULL
				)
			`);
		});
	}

	async pushBlock(data: PushBlockInput): Promise<void> {
		this.ctx.storage.sql.exec(
			`INSERT INTO blocks (jobId, blockType, status, inputUrl, outputUrl, metadata, createdAt)
			 VALUES (?, ?, ?, ?, ?, ?, ?)`,
			data.jobId,
			data.blockType,
			data.status,
			data.inputUrl,
			data.outputUrl,
			JSON.stringify(data.metadata),
			new Date().toISOString(),
		);
	}

	async getHistory(jobId: string): Promise<BlockRow[]> {
		return this.ctx.storage.sql
			.exec<BlockRow>(
				`SELECT * FROM blocks WHERE jobId = ? ORDER BY createdAt ASC`,
				jobId,
			)
			.toArray();
	}
}
