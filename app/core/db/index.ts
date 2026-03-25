import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../schemas";

export type DbClient = ReturnType<typeof createDb>;

export const createDb = (databaseUrl: string) => {
	const sql = neon(databaseUrl);
	return drizzle(sql, { schema });
};
