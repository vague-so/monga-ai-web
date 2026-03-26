import { StatusCodes } from "http-status-codes";
import { fail } from "./response";
import { AppError } from "./AppError";

export const handleError = (err: unknown): Response => {
	if (err instanceof AppError) {
		return fail(err.message, err.statusCode);
	}
	const message =
		err instanceof Error ? err.message : "Internal server error";
	return fail(message, StatusCodes.INTERNAL_SERVER_ERROR);
};
