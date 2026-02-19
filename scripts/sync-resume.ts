/**
 * Resume Sync Script: Download resume from Google Drive and upload to Vercel Blob
 *
 * This script:
 * 1. Downloads the resume PDF from Google Drive (exported from Google Docs)
 * 2. Uploads it to Vercel Blob storage
 * 3. Optionally updates Edge Config with the new URL
 *
 * Prerequisites:
 * 1. Set environment variables:
 *    - BLOB_READ_WRITE_TOKEN: Your Vercel Blob token
 *    - GOOGLE_DOC_ID: The Google Doc ID for your resume
 *    - EDGE_CONFIG_ID: (Optional) For auto-updating menu content
 *    - EDGE_CONFIG_TOKEN: (Optional) For auto-updating menu content
 *
 * Usage:
 *   npx tsx scripts/sync-resume.ts
 */

import { config } from "dotenv";
import { put } from "@vercel/blob";

// Load environment variables from .env.local
config({ path: ".env.local" });

// Configuration
const GOOGLE_DOC_ID = process.env.GOOGLE_DOC_ID;
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

const EDGE_CONFIG_ID = process.env.EDGE_CONFIG_ID;
const EDGE_CONFIG_TOKEN = process.env.EDGE_CONFIG_TOKEN; // Read token for fetching
const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN; // API token for writing

const RESUME_BLOB_PATH = "documents/resume.pdf";

/**
 * Download PDF from Google Docs
 */
async function downloadFromGoogleDocs(docId: string): Promise<Buffer> {
  const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=pdf`;

  console.log(`📥 Downloading resume from Google Docs...`);
  console.log(`   URL: ${exportUrl}`);

  const response = await fetch(exportUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to download from Google Docs: ${response.status} ${response.statusText}`,
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log(`   ✓ Downloaded ${(buffer.length / 1024).toFixed(1)} KB`);
  return buffer;
}

/**
 * Upload PDF to Vercel Blob
 */
async function uploadToBlob(pdfBuffer: Buffer): Promise<string> {
  console.log(`\n📤 Uploading to Vercel Blob...`);

  const blob = await put(RESUME_BLOB_PATH, pdfBuffer, {
    access: "public",
    contentType: "application/pdf",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  console.log(`   ✓ Uploaded to: ${blob.url}`);
  return blob.url;
}

/**
 * Update Edge Config with new resume URL
 */
async function updateEdgeConfig(resumeUrl: string): Promise<void> {
  if (!EDGE_CONFIG_ID || !EDGE_CONFIG_TOKEN) {
    console.log(`\n⚠️  Edge Config credentials not set, skipping menu update`);
    console.log(`   Set EDGE_CONFIG_ID and EDGE_CONFIG_TOKEN to enable`);
    return;
  }

  if (!VERCEL_API_TOKEN) {
    console.log(`\n⚠️  VERCEL_API_TOKEN not set, skipping menu update`);
    console.log(`   Create a token at: https://vercel.com/account/tokens`);
    return;
  }

  console.log(`\n🔄 Updating Edge Config...`);

  // Get current menu content using read token
  const getUrl = `https://edge-config.vercel.com/${EDGE_CONFIG_ID}/item/menu?token=${EDGE_CONFIG_TOKEN}`;
  const getResponse = await fetch(getUrl);

  if (!getResponse.ok) {
    const errorText = await getResponse.text();
    console.log(`   ⚠️  Could not fetch current menu: ${getResponse.status}`);
    console.log(`   Error: ${errorText}`);
    return;
  }

  const menuContent = await getResponse.json();

  // Update the resume URL
  const updatedMenu = {
    ...menuContent,
    externalLinks: menuContent.externalLinks.map(
      (link: {
        title: string;
        url: string;
        icon: string;
        download?: boolean;
      }) => (link.title === "Resume" ? { ...link, url: resumeUrl } : link),
    ),
  };

  // Update Edge Config using Vercel API token
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
    const errorText = await updateResponse.text();
    console.log(
      `   ⚠️  Failed to update Edge Config: ${updateResponse.status}`,
    );
    console.log(`   Error: ${errorText}`);
    return;
  }

  console.log(`   ✓ Updated menu in Edge Config`);
}

/**
 * Main sync function
 */
async function syncResume(): Promise<void> {
  console.log("🚀 Resume Sync Script\n");
  console.log("=".repeat(50));

  if (!GOOGLE_DOC_ID) {
    console.error("❌ Error: GOOGLE_DOC_ID environment variable is not set");
    console.error("\nTo find your Google Doc ID:");
    console.error("1. Open your resume in Google Docs");
    console.error("2. Copy the ID from the URL:");
    console.error(
      "   https://docs.google.com/document/d/YOUR_DOC_ID_HERE/edit",
    );
    process.exit(1);
  }

  if (!BLOB_READ_WRITE_TOKEN) {
    console.error(
      "❌ Error: BLOB_READ_WRITE_TOKEN environment variable is not set",
    );
    process.exit(1);
  }

  try {
    const pdfBuffer = await downloadFromGoogleDocs(GOOGLE_DOC_ID);
    const blobUrl = await uploadToBlob(pdfBuffer);
    await updateEdgeConfig(blobUrl);

    console.log("\n" + "=".repeat(50));
    console.log("✅ Resume sync complete!\n");
    console.log("📋 Resume URL:", blobUrl);
  } catch (error) {
    console.error("\n❌ Sync failed:", error);
    process.exit(1);
  }
}

syncResume();
