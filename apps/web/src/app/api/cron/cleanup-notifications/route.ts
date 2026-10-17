import { type NextRequest, NextResponse } from "next/server";
import { cleanupNotifications } from "@/features/notifications/actions/cleanup-notifications";

/** Always execute in the runtime (not statically optimized). */
export const dynamic = "force-dynamic";

/**
 * Cron endpoint for notification cleanup.
 *
 * Vercel cron jobs send `Authorization: Bearer <CRON_SECRET>`; plain curl
 * checkpoints may pass `?secret=` instead. Either is accepted.
 */
export const GET = async (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;
  const querySecret = request.nextUrl.searchParams.get("secret");

  const secret = bearerToken ?? querySecret;
  if (!secret) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const result = await cleanupNotifications(secret);
  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 401 },
    );
  }

  return NextResponse.json({
    success: true,
    deletedCount: result.deletedCount,
  });
};
