import ImageKit from "imagekit";

/**
 * ImageKit server-side SDK instance.
 * Uses environment variables for configuration.
 */
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

if (!publicKey || !privateKey || !urlEndpoint) {
  throw new Error("Missing ImageKit environment variables");
}

export const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});
