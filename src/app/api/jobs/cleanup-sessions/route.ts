import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { globalSessionCleanup } from "@/lib/auth";

/**
 * Check if request is authorized
 * In development: allow without auth for testing
 * In production: require auth or API key
 */
async function isAuthorized(req: NextRequest): Promise<boolean> {
  // In development, allow without authentication for easier testing
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  // In production, check for API key in header or require authentication
  const apiKey = req.headers.get("x-api-key");
  if (apiKey && apiKey === process.env.SESSION_CLEANUP_API_KEY) {
    return true;
  }

  // Fallback: require user authentication
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Cleanup endpoint for sessions
 * Can be called periodically (via cron, scheduled job, or manually)
 * Cleans up expired sessions and old inactive sessions
 */
export async function POST(req: NextRequest) {
  try {
    // Check authorization
    if (!(await isAuthorized(req))) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          hint:
            process.env.NODE_ENV === "production"
              ? "Provide x-api-key header or authenticate"
              : "This should work in development - check your setup",
        },
        { status: 401 }
      );
    }

    // Run global session cleanup
    const result = await globalSessionCleanup();

    return NextResponse.json({
      success: true,
      cleanup: result,
      message: `Cleaned up ${result.totalDeleted} sessions (${result.expiredDeleted} expired, ${result.oldDeleted} old inactive)`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to cleanup sessions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET endpoint for manual testing/verification
 */
export async function GET(req: NextRequest) {
  try {
    // Check authorization
    if (!(await isAuthorized(req))) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          hint:
            process.env.NODE_ENV === "production"
              ? "Provide x-api-key header or authenticate"
              : "This should work in development - check your setup",
        },
        { status: 401 }
      );
    }

    // Run global session cleanup
    const result = await globalSessionCleanup();

    return NextResponse.json({
      success: true,
      cleanup: result,
      message: `Cleaned up ${result.totalDeleted} sessions (${result.expiredDeleted} expired, ${result.oldDeleted} old inactive)`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to cleanup sessions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

