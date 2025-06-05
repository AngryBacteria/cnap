export async function URLToBase64(
	url: string,
	addURL = false,
): Promise<string> {
	const response = await fetch(url);
	const arrayBuffer = await response.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const base64 = buffer.toString("base64");
	if (addURL) {
		const mimeType =
			response.headers.get("content-type") || "application/octet-stream";
		return `data:${mimeType};base64,${base64}`;
	}
	return base64;
}
