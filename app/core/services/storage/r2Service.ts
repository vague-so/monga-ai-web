export interface R2UploadResult {
	key: string;
	url: string;
}

export class R2Service {
	constructor(private readonly bucket: R2Bucket) {}

	async upload(file: File, baseUrl: string): Promise<R2UploadResult> {
		const ext = file.name.split(".").pop() ?? "bin";
		const key = `uploads/${crypto.randomUUID()}.${ext}`;

		await this.bucket.put(key, file.stream(), {
			httpMetadata: { contentType: file.type },
		});

		return { key, url: `${baseUrl}/r2/${key}` };
	}

	async get(key: string): Promise<R2ObjectBody | null> {
		return this.bucket.get(key);
	}
}
