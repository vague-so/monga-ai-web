const FAL_BIREFNET_ENDPOINT = "https://queue.fal.run/fal-ai/birefnet";

export interface FalResult {
	requestId: string | null;
	outputUrl: string | null;
	rawResponse: Record<string, unknown>;
}

export class FalService {
	private readonly gatewayUrl: string;

	constructor(private readonly env: Env) {
		this.gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${env.CF_ACCOUNT_ID}/${env.CF_AIG_NAME}/fal`;
	}

	async runBirefnet(inputUrl: string): Promise<FalResult> {
		const response = await fetch(this.gatewayUrl, {
			method: "POST",
			headers: {
				Authorization: `Key ${this.env.FAL_KEY}`,
				"cf-aig-authorization": `Bearer ${this.env.CF_AIG_TOKEN}`,
				"Content-Type": "application/json",
				"x-fal-target-url": FAL_BIREFNET_ENDPOINT,
			},
			body: JSON.stringify({ image_url: inputUrl }),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`fal.ai request failed [${response.status}]: ${errorText}`,
			);
		}

		const data = (await response.json()) as Record<string, unknown>;
		const images = data.images as Array<{ url: string }> | undefined;
		const image = data.image as { url: string } | undefined;
		const outputUrl = images?.[0]?.url ?? image?.url ?? null;
		const requestId =
			typeof data.request_id === "string" ? data.request_id : null;

		return { requestId, outputUrl, rawResponse: data };
	}
}
