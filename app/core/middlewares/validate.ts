import type { ZodSchema } from "zod";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { fail } from "../lib/response";

type ParseSuccess<T> = { data: T; error: null };
type ParseFailure = { data: null; error: Response };
type ParseResult<T> = ParseSuccess<T> | ParseFailure;

const formatZodError = (err: ZodError) =>
	err.issues.map((issue) => ({
		path: issue.path.join("."),
		message: issue.message,
	}));

export const parseBody = async <T>(
	request: Request,
	schema: ZodSchema<T>,
): Promise<ParseResult<T>> => {
	let raw: unknown;
	try {
		raw = await request.json();
	} catch {
		return {
			data: null,
			error: fail("Invalid JSON body", StatusCodes.BAD_REQUEST),
		};
	}

	const result = schema.safeParse(raw);
	if (!result.success) {
		return {
			data: null,
			error: fail(
				"Validation failed",
				StatusCodes.UNPROCESSABLE_ENTITY,
				formatZodError(result.error),
			),
		};
	}

	return { data: result.data, error: null };
};
