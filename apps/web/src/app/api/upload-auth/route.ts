import { NextResponse } from "next/server";
import { imagekit } from "@/lib/imagekit";

/**
 * GET handler for ImageKit client-side upload authentication.
 * Returns the signature, token, and expiration time.
 */
export async function GET() {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParams);
  } catch (error) {
    console.error("Error generating ImageKit auth parameters:", error);
    return NextResponse.json(
      { error: "Failed to generate authentication parameters" },
      { status: 500 },
    );
  }
}
