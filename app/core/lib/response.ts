export const jsonResponse = (data: unknown, status = 200) =>
	Response.json(data, { status });

export const ok = (data: unknown) =>
	jsonResponse({ success: true, data });

export const fail = (message: string, httpStatus: number, details?: unknown) =>
	jsonResponse(
		{ success: false, message, ...(details !== undefined && { details }) },
		httpStatus,
	);
