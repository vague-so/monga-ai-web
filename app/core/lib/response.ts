import { StatusCodes } from "http-status-codes";

export const jsonResponse = (data: unknown, status = StatusCodes.OK) =>
	Response.json(data, { status });

export const ok = (data: unknown) =>
	jsonResponse({ success: true, data });

export const fail = (message: string, httpStatus: number, details?: unknown) =>
	jsonResponse(
		{ success: false, message, ...(details !== undefined && { details }) },
		httpStatus,
	);
