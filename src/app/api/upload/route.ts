import { NextRequest, NextResponse } from "next/server";
import { uploadImage, uploadIcon, uploadDocument, deleteBlob } from "@/lib/blob/upload";

// Secret key to prevent unauthorized uploads
// Set this in your Vercel environment variables
const UPLOAD_SECRET = process.env.UPLOAD_SECRET;

/**
 * File Upload API Endpoint
 *
 * Handles file uploads to Vercel Blob storage.
 * Requires authorization via Bearer token.
 *
 * Usage:
 * POST /api/upload
 * Headers: { "Authorization": "Bearer YOUR_SECRET" }
 * Body: FormData with:
 *   - file: The file to upload
 *   - type: "image" | "icon" | "document" (default: "image")
 *   - folder: Custom folder path (optional)
 *   - variant: For icons, "ui" or "tech" (default: "tech")
 *   - name: Custom filename (optional)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!UPLOAD_SECRET) {
      console.warn("UPLOAD_SECRET not set - upload endpoint is disabled");
      return NextResponse.json(
        { error: "Upload endpoint not configured" },
        { status: 503 }
      );
    }

    if (token !== UPLOAD_SECRET) {
      return NextResponse.json(
        { error: "Invalid authorization token" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "image";
    const folder = formData.get("folder") as string | null;
    const variant = (formData.get("variant") as "ui" | "tech") || "tech";
    const name = formData.get("name") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case "icon":
        if (!name) {
          return NextResponse.json(
            { error: "Icon name is required" },
            { status: 400 }
          );
        }
        result = await uploadIcon(file, variant, name);
        break;

      case "document":
        result = await uploadDocument(file, { filename: name || undefined });
        break;

      case "image":
      default:
        result = await uploadImage(file, folder || "images", {
          filename: name || undefined,
        });
        break;
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      pathname: result.pathname,
      contentType: result.contentType,
      size: result.size,
      originalName: result.originalName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE endpoint for removing files from Vercel Blob
 *
 * Usage:
 * DELETE /api/upload?url=https://...blob.vercel-storage.com/...
 * Headers: { "Authorization": "Bearer YOUR_SECRET" }
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!UPLOAD_SECRET) {
      return NextResponse.json(
        { error: "Upload endpoint not configured" },
        { status: 503 }
      );
    }

    if (token !== UPLOAD_SECRET) {
      return NextResponse.json(
        { error: "Invalid authorization token" },
        { status: 401 }
      );
    }

    const url = request.nextUrl.searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // Validate it's a Vercel Blob URL
    if (!url.includes("blob.vercel-storage.com")) {
      return NextResponse.json(
        { error: "Invalid blob URL" },
        { status: 400 }
      );
    }

    await deleteBlob(url);

    return NextResponse.json({
      success: true,
      deleted: url,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Delete failed", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for health check
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    configured: !!UPLOAD_SECRET,
    message: UPLOAD_SECRET
      ? "Upload endpoint is configured"
      : "UPLOAD_SECRET not set - endpoint disabled",
  });
}
