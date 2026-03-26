import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
	constructor(
		message: string,
		public readonly statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
	) {
		super(message);
		this.name = "AppError";
	}
}
