import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".dev.vars" });

export default defineConfig({
	schema: "./app/core/schemas/index.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
