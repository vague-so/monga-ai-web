import { FalService } from "../../services/ai/falService";
import { R2Service } from "../../services/storage/r2Service";
import { ok, fail } from "../../lib/response";

export const executePipeline = async (
	request: Request,
	env: Env,
): Promise<Response> => {
	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		return fail("Invalid multipart/form-data body", 400);
	}

	const file = formData.get("image");
	if (!(file instanceof File)) {
		return fail("Missing or invalid 'image' field in form data", 400);
	}

	const jobId = crypto.randomUUID();
	const baseUrl = new URL(request.url).origin;

	const r2 = new R2Service(env.MY_BUCKET);
	let inputUrl: string;
	try {
		const upload = await r2.upload(file, baseUrl);
		inputUrl = upload.url;
	} catch (err) {
		return fail("Failed to upload image to R2", 500, String(err));
	}

	const doId = env.PIPELINE_TRACKER.idFromName(jobId);
	const tracker = env.PIPELINE_TRACKER.get(doId);

	const fal = new FalService(env);
	let blockResult: Awaited<ReturnType<FalService["runBirefnet"]>>;
	try {
		blockResult = await fal.runBirefnet(inputUrl);
	} catch (err) {
		return fail("Background removal block failed", 502, String(err));
	}

	const outputUrl = blockResult.outputUrl ?? "";
	const blockStatus = blockResult.outputUrl ? "completed" : "queued";

	await tracker.pushBlock({
		jobId,
		blockType: "birefnet",
		status: blockStatus,
		inputUrl,
		outputUrl,
		metadata: blockResult.rawResponse,
	});

	return ok({
		jobId,
		inputUrl,
		outputUrl,
		status: blockStatus,
		falResponse: blockResult.rawResponse,
	});
};
