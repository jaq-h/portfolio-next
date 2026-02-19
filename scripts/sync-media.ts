/**
 * Media Sync Script: Upload images and icons to Vercel Blob
 *
 * This script:
 * 1. Uploads images from public/images to Vercel Blob
 * 2. Uploads icons from public/icons to Vercel Blob
 * 3. Optionally updates Edge Config with the new URLs
 *
 * Prerequisites:
 * 1. Set environment variables:
 *    - BLOB_READ_WRITE_TOKEN: Your Vercel Blob token
 *    - EDGE_CONFIG_ID: (Optional) For auto-updating content
 *    - EDGE_CONFIG_TOKEN: (Optional) For reading Edge Config
 *    - VERCEL_API_TOKEN: (Optional) For writing to Edge Config
 *
 * Usage:
 *   npx tsx scripts/sync-media.ts [options]
 *
 * Options:
 *   --images     Sync only images
 *   --icons      Sync only icons
 *   --all        Sync both images and icons (default)
 *   --dry-run    Show what would be uploaded without uploading
 *   --update-config  Update Edge Config with new URLs
 */

import { config } from "dotenv";
import { put, list } from "@vercel/blob";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname, basename } from "path";

// Load environment variables from .env.local
config({ path: ".env.local" });

// Configuration
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const EDGE_CONFIG_ID = process.env.EDGE_CONFIG_ID;
const EDGE_CONFIG_TOKEN = process.env.EDGE_CONFIG_TOKEN;
const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;

// Paths
const PUBLIC_DIR = join(process.cwd(), "public");
const IMAGES_DIR = join(PUBLIC_DIR, "images");
const ICONS_DIR = join(PUBLIC_DIR, "icons");

// Supported file types
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"];
const ICON_EXTENSIONS = [".svg"];

// Types
interface UploadResult {
  localPath: string;
  blobUrl: string;
  filename: string;
}

interface SyncOptions {
  images: boolean;
  icons: boolean;
  dryRun: boolean;
  updateConfig: boolean;
}

/**
 * Parse command line arguments
 */
function parseArgs(): SyncOptions {
  const args = process.argv.slice(2);

  const options: SyncOptions = {
    images: false,
    icons: false,
    dryRun: false,
    updateConfig: false,
  };

  // Check for specific flags
  const hasImages = args.includes("--images");
  const hasIcons = args.includes("--icons");
  const hasAll = args.includes("--all");

  // If no specific media type is specified, default to all
  if ((!hasImages && !hasIcons) || hasAll) {
    options.images = true;
    options.icons = true;
  } else {
    options.images = hasImages;
    options.icons = hasIcons;
  }

  if (args.includes("--dry-run")) {
    options.dryRun = true;
  }

  if (args.includes("--update-config")) {
    options.updateConfig = true;
  }

  return options;
}

/**
 * Get all files in a directory recursively
 */
function getFilesRecursively(
  dir: string,
  extensions: string[],
  baseDir: string = dir,
): string[] {
  const files: string[] = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...getFilesRecursively(fullPath, extensions, baseDir));
      } else if (extensions.includes(extname(entry).toLowerCase())) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return files;
}

/**
 * Get content type from file extension
 */
function getContentType(filename: string): string {
  const ext = extname(filename).toLowerCase();
  const contentTypes: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".svg": "image/svg+xml",
  };
  return contentTypes[ext] || "application/octet-stream";
}

/**
 * Upload a single file to Vercel Blob
 */
async function uploadFile(
  localPath: string,
  blobFolder: string,
  relativePath: string,
): Promise<UploadResult> {
  const fileContent = readFileSync(localPath);
  const blobPath = `${blobFolder}/${relativePath}`;

  const blob = await put(blobPath, fileContent, {
    access: "public",
    contentType: getContentType(localPath),
    allowOverwrite: true,
    addRandomSuffix: false,
  });

  return {
    localPath,
    blobUrl: blob.url,
    filename: basename(localPath),
  };
}

/**
 * Sync images to Vercel Blob
 */
async function syncImages(dryRun: boolean): Promise<UploadResult[]> {
  console.log("\n📷 Syncing images...");

  const files = getFilesRecursively(IMAGES_DIR, IMAGE_EXTENSIONS);

  if (files.length === 0) {
    console.log("   No images found");
    return [];
  }

  console.log(`   Found ${files.length} image(s)`);

  const results: UploadResult[] = [];

  for (const file of files) {
    const relativePath = file.replace(IMAGES_DIR + "/", "");
    console.log(
      `   ${dryRun ? "[DRY RUN] Would upload" : "Uploading"}: ${relativePath}`,
    );

    if (!dryRun) {
      const result = await uploadFile(file, "images", relativePath);
      results.push(result);
      console.log(`   ✓ Uploaded to: ${result.blobUrl}`);
    }
  }

  return results;
}

/**
 * Sync icons to Vercel Blob
 */
async function syncIcons(dryRun: boolean): Promise<UploadResult[]> {
  console.log("\n🎨 Syncing icons...");

  const files = getFilesRecursively(ICONS_DIR, ICON_EXTENSIONS);

  if (files.length === 0) {
    console.log("   No icons found");
    return [];
  }

  console.log(`   Found ${files.length} icon(s)`);

  const results: UploadResult[] = [];

  for (const file of files) {
    const relativePath = file.replace(ICONS_DIR + "/", "");
    console.log(
      `   ${dryRun ? "[DRY RUN] Would upload" : "Uploading"}: ${relativePath}`,
    );

    if (!dryRun) {
      const result = await uploadFile(file, "icons", relativePath);
      results.push(result);
      console.log(`   ✓ Uploaded to: ${result.blobUrl}`);
    }
  }

  return results;
}

/**
 * Update Edge Config with new image URLs
 */
async function updateEdgeConfigProjects(
  imageResults: UploadResult[],
): Promise<void> {
  if (!EDGE_CONFIG_ID || !EDGE_CONFIG_TOKEN || !VERCEL_API_TOKEN) {
    console.log(
      "\n⚠️  Edge Config credentials not fully set, skipping config update",
    );
    console.log(
      "   Required: EDGE_CONFIG_ID, EDGE_CONFIG_TOKEN, VERCEL_API_TOKEN",
    );
    return;
  }

  if (imageResults.length === 0) {
    console.log("\n⚠️  No images uploaded, skipping config update");
    return;
  }

  console.log("\n🔄 Updating Edge Config projects...");

  // Build URL mapping from local paths to blob URLs
  const urlMap: Record<string, string> = {};
  for (const result of imageResults) {
    // Map from /filename.ext to blob URL
    const localUrl = `/${result.filename}`;
    urlMap[localUrl] = result.blobUrl;
  }

  // Get current projects content
  const getUrl = `https://edge-config.vercel.com/${EDGE_CONFIG_ID}/item/projects?token=${EDGE_CONFIG_TOKEN}`;
  const getResponse = await fetch(getUrl);

  if (!getResponse.ok) {
    const errorText = await getResponse.text();
    console.log(
      `   ⚠️  Could not fetch current projects: ${getResponse.status}`,
    );
    console.log(`   Error: ${errorText}`);
    return;
  }

  const projectsContent = await getResponse.json();

  // Update media URLs in projects
  let updatedCount = 0;
  const updatedProjects = {
    ...projectsContent,
    projects: projectsContent.projects.map(
      (project: {
        title: string;
        projectMedia?: { mediaType: string; mediaSrc: string };
      }) => {
        if (project.projectMedia?.mediaSrc) {
          const newUrl = urlMap[project.projectMedia.mediaSrc];
          if (newUrl) {
            updatedCount++;
            return {
              ...project,
              projectMedia: {
                ...project.projectMedia,
                mediaSrc: newUrl,
              },
            };
          }
        }
        return project;
      },
    ),
  };

  if (updatedCount === 0) {
    console.log("   No project media URLs to update");
    return;
  }

  // Update Edge Config
  const updateUrl = `https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items`;
  const updateResponse = await fetch(updateUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ operation: "upsert", key: "projects", value: updatedProjects }],
    }),
  });

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    console.log(
      `   ⚠️  Failed to update Edge Config: ${updateResponse.status}`,
    );
    console.log(`   Error: ${errorText}`);
    return;
  }

  console.log(
    `   ✓ Updated ${updatedCount} project media URL(s) in Edge Config`,
  );
}

/**
 * Update Edge Config with new profile image URL
 */
async function updateEdgeConfigMenu(
  imageResults: UploadResult[],
): Promise<void> {
  if (!EDGE_CONFIG_ID || !EDGE_CONFIG_TOKEN || !VERCEL_API_TOKEN) {
    return;
  }

  // Check if profile.png was uploaded
  const profileResult = imageResults.find((r) => r.filename === "profile.png");
  if (!profileResult) {
    return;
  }

  console.log("\n🔄 Updating Edge Config menu (profile image)...");

  // Get current menu content
  const getUrl = `https://edge-config.vercel.com/${EDGE_CONFIG_ID}/item/menu?token=${EDGE_CONFIG_TOKEN}`;
  const getResponse = await fetch(getUrl);

  if (!getResponse.ok) {
    console.log(`   ⚠️  Could not fetch current menu`);
    return;
  }

  const menuContent = await getResponse.json();

  // Update profile image URL
  const updatedMenu = {
    ...menuContent,
    profile: {
      ...menuContent.profile,
      image: profileResult.blobUrl,
    },
  };

  // Update Edge Config
  const updateUrl = `https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items`;
  const updateResponse = await fetch(updateUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ operation: "upsert", key: "menu", value: updatedMenu }],
    }),
  });

  if (!updateResponse.ok) {
    console.log(`   ⚠️  Failed to update menu in Edge Config`);
    return;
  }

  console.log(`   ✓ Updated profile image URL in Edge Config`);
}

/**
 * List existing blobs for reference
 */
async function listExistingBlobs(): Promise<void> {
  console.log("\n📋 Existing blobs in storage:");

  try {
    const { blobs } = await list();

    if (blobs.length === 0) {
      console.log("   No existing blobs found");
      return;
    }

    const images = blobs.filter((b) => b.pathname.startsWith("images/"));
    const icons = blobs.filter((b) => b.pathname.startsWith("icons/"));
    const documents = blobs.filter((b) => b.pathname.startsWith("documents/"));
    const other = blobs.filter(
      (b) =>
        !b.pathname.startsWith("images/") &&
        !b.pathname.startsWith("icons/") &&
        !b.pathname.startsWith("documents/"),
    );

    if (images.length > 0) {
      console.log(`   Images (${images.length}):`);
      images.forEach((b) => console.log(`     - ${b.pathname}`));
    }

    if (icons.length > 0) {
      console.log(`   Icons (${icons.length}):`);
      icons.forEach((b) => console.log(`     - ${b.pathname}`));
    }

    if (documents.length > 0) {
      console.log(`   Documents (${documents.length}):`);
      documents.forEach((b) => console.log(`     - ${b.pathname}`));
    }

    if (other.length > 0) {
      console.log(`   Other (${other.length}):`);
      other.forEach((b) => console.log(`     - ${b.pathname}`));
    }
  } catch (error) {
    console.log("   Could not list blobs:", error);
  }
}

/**
 * Print usage information
 */
function printUsage(): void {
  console.log(`
Usage: npx tsx scripts/sync-media.ts [options]

Options:
  --images         Sync only images from public/images
  --icons          Sync only icons from public/icons
  --all            Sync both images and icons (default)
  --dry-run        Show what would be uploaded without uploading
  --update-config  Update Edge Config with new URLs
  --help           Show this help message

Examples:
  npx tsx scripts/sync-media.ts --all
  npx tsx scripts/sync-media.ts --images --update-config
  npx tsx scripts/sync-media.ts --icons --dry-run
  npm run sync:media -- --images
`);
}

/**
 * Main sync function
 */
async function syncMedia(): Promise<void> {
  const options = parseArgs();

  if (process.argv.includes("--help")) {
    printUsage();
    return;
  }

  console.log("🚀 Media Sync Script\n");
  console.log("=".repeat(50));

  if (options.dryRun) {
    console.log("🔍 DRY RUN MODE - No files will be uploaded");
  }

  // Validate environment
  if (!BLOB_READ_WRITE_TOKEN) {
    console.error(
      "❌ Error: BLOB_READ_WRITE_TOKEN environment variable is not set",
    );
    process.exit(1);
  }

  console.log(`\nOptions:`);
  console.log(`  - Images: ${options.images ? "Yes" : "No"}`);
  console.log(`  - Icons: ${options.icons ? "Yes" : "No"}`);
  console.log(`  - Update Config: ${options.updateConfig ? "Yes" : "No"}`);
  console.log(`  - Dry Run: ${options.dryRun ? "Yes" : "No"}`);

  try {
    let imageResults: UploadResult[] = [];
    let iconResults: UploadResult[] = [];

    // Sync images
    if (options.images) {
      imageResults = await syncImages(options.dryRun);
    }

    // Sync icons
    if (options.icons) {
      iconResults = await syncIcons(options.dryRun);
    }

    // Update Edge Config if requested and not dry run
    if (options.updateConfig && !options.dryRun) {
      if (imageResults.length > 0) {
        await updateEdgeConfigProjects(imageResults);
        await updateEdgeConfigMenu(imageResults);
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("✅ Media sync complete!\n");

    if (!options.dryRun) {
      console.log("📊 Summary:");
      console.log(`   - Images uploaded: ${imageResults.length}`);
      console.log(`   - Icons uploaded: ${iconResults.length}`);

      if (imageResults.length > 0) {
        console.log("\n📷 Uploaded Images:");
        imageResults.forEach((r) => {
          console.log(`   ${r.filename} → ${r.blobUrl}`);
        });
      }

      if (iconResults.length > 0) {
        console.log("\n🎨 Uploaded Icons:");
        iconResults.forEach((r) => {
          console.log(`   ${r.filename} → ${r.blobUrl}`);
        });
      }

      // List all blobs
      await listExistingBlobs();
    }
  } catch (error) {
    console.error("\n❌ Sync failed:", error);
    process.exit(1);
  }
}

// Run the script
syncMedia();
