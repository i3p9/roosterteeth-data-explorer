import { decode } from "blurhash";

export const blurHashToDataURL = (hash) => {
	if (!hash) return null;

	// Check if we're in a browser environment
	const isBrowser = typeof window !== "undefined";

	if (!isBrowser) {
		// Return a placeholder or null for server-side rendering
		return null;
	}

	const pixels = decode(hash, 32, 32);
	const canvas = document.createElement("canvas");
	canvas.width = 32;
	canvas.height = 32;
	const ctx = canvas.getContext("2d");
	const imageData = ctx.createImageData(32, 32);
	imageData.data.set(pixels);
	ctx.putImageData(imageData, 0, 0);
	return canvas.toDataURL();
};
