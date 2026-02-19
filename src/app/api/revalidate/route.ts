import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Secret key to prevent unauthorized revalidation requests
// Set this in your Vercel environment variables
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

/**
 * On-demand revalidation API endpoint
 *
 * Triggers ISR revalidation when content is updated in Edge Config or Vercel Blob
 * without waiting for the automatic revalidation period.
 *
 * Usage:
 * POST /api/revalidate
 * Headers: { "Authorization": "Bearer YOUR_SECRET" }
 * Body: { "paths": ["/", "/projects"], "tags": ["content"] }
 *
 * Or revalidate everything:
 * POST /api/revalidate
 * Headers: { "Authorization": "Bearer YOUR_SECRET" }
 * Body: { "all": true }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!REVALIDATION_SECRET) {
      console.warn("REVALIDATION_SECRET not set - revalidation endpoint is disabled");
      return NextResponse.json(
        { error: "Revalidation endpoint not configured" },
        { status: 503 }
      );
    }

    if (token !== REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: "Invalid authorization token" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json().catch(() => ({}));
    const { paths, tags, all } = body as {
      paths?: string[];
      tags?: string[];
      all?: boolean;
    };

    const revalidated: { paths: string[]; tags: string[] } = {
      paths: [],
      tags: [],
    };

    // Revalidate all main paths if requested
    if (all) {
      const allPaths = ["/", "/about", "/projects", "/contact"];
      for (const path of allPaths) {
        revalidatePath(path);
        revalidated.paths.push(path);
      }
    } else {
      // Revalidate specific paths
      if (paths && Array.isArray(paths)) {
        for (const path of paths) {
          if (typeof path === "string" && path.startsWith("/")) {
            revalidatePath(path);
            revalidated.paths.push(path);
          }
        }
      }

      // Revalidate by tags
      if (tags && Array.isArray(tags)) {
        for (const tag of tags) {
          if (typeof tag === "string") {
            revalidateTag(tag);
            revalidated.tags.push(tag);
          }
        }
      }
    }

    // If nothing was specified, revalidate the layout (affects all pages)
    if (revalidated.paths.length === 0 && revalidated.tags.length === 0) {
      revalidatePath("/", "layout");
      revalidated.paths.push("/ (layout)");
    }

    return NextResponse.json({
      success: true,
      revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Revalidation failed", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for simple revalidation (e.g., from a webhook URL)
 * Requires secret as query parameter
 *
 * Usage:
 * GET /api/revalidate?secret=YOUR_SECRET&path=/projects
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");
  const path = searchParams.get("path");

  if (!REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: "Revalidation endpoint not configured" },
      { status: 503 }
    );
  }

  if (secret !== REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: "Invalid secret" },
      { status: 401 }
    );
  }

  try {
    if (path) {
      revalidatePath(path);
      return NextResponse.json({
        success: true,
        revalidated: { path },
        timestamp: new Date().toISOString(),
      });
    } else {
      // Revalidate all if no path specified
      revalidatePath("/", "layout");
      return NextResponse.json({
        success: true,
        revalidated: { path: "/ (layout - all pages)" },
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Revalidation failed" },
      { status: 500 }
    );
  }
}
