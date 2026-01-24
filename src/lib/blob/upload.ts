/**
 * Vercel Blob Upload Utilities
 *
 * Utilities for uploading images and files to Vercel Blob storage.
 * These can be used in API routes or server actions to handle file uploads.
 *
 * Prerequisites:
 * 1. Enable Vercel Blob in your project (Vercel Dashboard > Storage > Blob)
 * 2. BLOB_READ_WRITE_TOKEN is automatically set when connected
 *
 * Usage:
 *   import { uploadImage, uploadFile } from '@/lib/blob/upload';
 *
 *   // In an API route or server action
 *   const { url } = await uploadImage(file, 'profile-photos');
 */

import { put, del, list, type PutBlobResult } from "@vercel/blob";

/**
 * Upload options for blob storage
 */
interface UploadOptions {
  /** Custom filename (optional - will use original name if not provided) */
  filename?: string;
  /** Folder path within blob storage (e.g., 'images/profile') */
  folder?: string;
  /** Content type override */
  contentType?: string;
  /** Whether the file should be publicly accessible (default: true) */
  access?: "public";
  /** Additional cache control headers */
  cacheControlMaxAge?: number;
}

/**
 * Upload result with additional metadata
 */
interface UploadResult extends PutBlobResult {
  /** Original filename */
  originalName: string;
  /** File size in bytes */
  size: number;
}

/**
 * Upload a file to Vercel Blob storage
 *
 * @param file - File or Blob to upload
 * @param options - Upload options
 * @returns Upload result with URL and metadata
 */
export async function uploadFile(
  file: File | Blob,
  options: UploadOptions = {},
): Promise<UploadResult> {
  const { filename, folder, contentType, access = "public", cacheControlMaxAge } = options;

  // Determine the filename
  const originalName = file instanceof File ? file.name : "file";
  const finalFilename = filename || originalName;

  // Build the full path
  const pathname = folder ? `${folder}/${finalFilename}` : finalFilename;

  // Upload to Vercel Blob
  const result = await put(pathname, file, {
    access,
    contentType: contentType || (file instanceof File ? file.type : undefined),
    cacheControlMaxAge,
  });

  return {
    ...result,
    originalName,
    size: file.size,
  };
}

/**
 * Upload an image to Vercel Blob storage
 * Validates that the file is an image type
 *
 * @param file - Image file to upload
 * @param folder - Folder path (default: 'images')
 * @param options - Additional upload options
 * @returns Upload result with URL and metadata
 */
export async function uploadImage(
  file: File | Blob,
  folder: string = "images",
  options: Omit<UploadOptions, "folder"> = {},
): Promise<UploadResult> {
  // Validate image type
  const mimeType = file instanceof File ? file.type : options.contentType;
  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/avif",
  ];

  if (mimeType && !validImageTypes.includes(mimeType)) {
    throw new Error(`Invalid image type: ${mimeType}. Allowed types: ${validImageTypes.join(", ")}`);
  }

  return uploadFile(file, { ...options, folder });
}

/**
 * Upload an SVG icon to Vercel Blob storage
 *
 * @param file - SVG file to upload
 * @param variant - Icon variant ('ui' or 'tech')
 * @param name - Icon name (used as filename)
 * @returns Upload result with URL and metadata
 */
export async function uploadIcon(
  file: File | Blob,
  variant: "ui" | "tech",
  name: string,
): Promise<UploadResult> {
  const folder = variant === "ui" ? "icons/ui" : "icons/tech";
  const filename = name.endsWith(".svg") ? name : `${name}.svg`;

  return uploadFile(file, {
    folder,
    filename,
    contentType: "image/svg+xml",
    cacheControlMaxAge: 31536000, // 1 year (icons rarely change)
  });
}

/**
 * Upload a document (PDF, etc.) to Vercel Blob storage
 *
 * @param file - Document file to upload
 * @param options - Upload options
 * @returns Upload result with URL and metadata
 */
export async function uploadDocument(
  file: File | Blob,
  options: Omit<UploadOptions, "folder"> = {},
): Promise<UploadResult> {
  return uploadFile(file, { ...options, folder: "documents" });
}

/**
 * Delete a file from Vercel Blob storage
 *
 * @param url - The blob URL to delete
 */
export async function deleteBlob(url: string): Promise<void> {
  await del(url);
}

/**
 * List all files in a folder
 *
 * @param prefix - Folder prefix to list (e.g., 'images/profile')
 * @returns List of blobs in the folder
 */
export async function listBlobs(prefix?: string) {
  const result = await list({ prefix });
  return result.blobs;
}

/**
 * Upload multiple files in parallel
 *
 * @param files - Array of files with their options
 * @returns Array of upload results
 */
export async function uploadMultiple(
  files: Array<{ file: File | Blob; options?: UploadOptions }>,
): Promise<UploadResult[]> {
  const uploads = files.map(({ file, options }) => uploadFile(file, options));
  return Promise.all(uploads);
}

/**
 * Get a public URL for a blob
 * Vercel Blob URLs are already public, this is just a utility for consistency
 *
 * @param blobUrl - The blob URL
 * @returns The same URL (blobs are public by default)
 */
export function getPublicUrl(blobUrl: string): string {
  return blobUrl;
}
