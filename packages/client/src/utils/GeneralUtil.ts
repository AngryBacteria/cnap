export function capitalizeFirstLetter(
	val: string,
	lower = false,
	trim = false,
): string {
	if (!val) {
		return "";
	}
	let transformed = val;
	if (lower) {
		transformed = val.toLowerCase();
	}
	if (trim) {
		transformed = val.trim();
	}
	return transformed.charAt(0).toUpperCase() + transformed.slice(1);
}

export function truncateText(value: string, maxLength: number) {
	const truncated = value.slice(0, maxLength);
	// Search for last .
	const lastDot = truncated.lastIndexOf(".");
	if (lastDot !== -1) {
		return `${truncated.slice(0, lastDot + 1)}...`;
	}
	// Search for last whitespace if no . is found
	const lastSpace = truncated.lastIndexOf(" ");
	if (lastSpace !== -1) {
		return `${truncated.slice(0, lastSpace)}...`;
	}
	// If no . or whitespace is found, return the truncated string
	return `${truncated}...`;
}

export async function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			const base64String = (reader.result as string).split(",")[1];
			resolve(base64String);
		};
		reader.onerror = (error) => reject(error);
	});
}
