import { R2Service } from "../services/storage/r2Service";

export const handleR2Routes = async (
	request: Request,
	env: Env,
): Promise<Response | null> => {
	const { pathname } = new URL(request.url);

	if (request.method !== "GET") return null;

	const key = pathname.slice(4);
	if (!key) return new Response("Not Found", { status: 404 });

	const r2 = new R2Service(env.MY_BUCKET);
	const object = await r2.get(key);
	if (!object) return new Response("Not Found", { status: 404 });

	const headers = new Headers();
	object.writeHttpMetadata(headers);
	headers.set("etag", object.httpEtag);
	return new Response(object.body, { headers });
};
