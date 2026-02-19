/**
 * Migration Script: Push local JSON content to Vercel Edge Config
 *
 * This script reads your local JSON content files from public/content/
 * and uploads them to Vercel Edge Config for production use.
 *
 * Prerequisites:
 * 1. Create an Edge Config in Vercel Dashboard (Storage > Edge Config)
 * 2. Get your Edge Config ID and Token from the dashboard
 * 3. Set environment variables:
 *    - EDGE_CONFIG_ID: Your Edge Config ID
 *    - EDGE_CONFIG_TOKEN: Your Edge Config write token
 *
 * Usage:
 *   npx tsx scripts/migrate-to-edge-config.ts
 *
 * Or add to package.json scripts:
 *   "migrate:edge-config": "tsx scripts/migrate-to-edge-config.ts"
 */

import { readFileSync } from "fs";
import { join } from "path";

// Edge Config API endpoint
const EDGE_CONFIG_API = "https://api.vercel.com/v1/edge-config";

// Type definitions matching the content schema

interface PageHeader {
  title: string;
  subtitle: string;
  icon: string;
}

interface MenuContent {
  profile: {
    name: string;
    title: string;
    image: string;
  };
  navigation: Array<{
    title: string;
    path: string;
    icon: string;
  }>;
  externalLinks: Array<{
    title: string;
    url: string;
    icon: string;
    download?: boolean;
  }>;
  footer: {
    copyright: string;
  };
}

interface ProjectsContent {
  pageHeader: PageHeader;
  projects: Array<{
    title: string;
    description: string;
    projectLinks: Array<{
      title: string;
      icon: string;
      link: string;
    }>;
    projectMedia: {
      mediaType: string;
      mediaSrc: string;
    };
    techStack: Array<{
      name: string;
      icon: string;
    }>;
  }>;
}

interface AboutContent {
  pageHeader: PageHeader;
  intro: {
    heading: string;
    text: string;
  };
  skills: {
    heading: string;
    items: string[];
  };
  contact: {
    heading: string;
    text: string;
  };
}

interface ContactContent {
  pageHeader: PageHeader;
  sections: {
    email: {
      heading: string;
      description?: string;
    };
    connect: {
      heading: string;
    };
  };
}

async function main() {
  // Check for required environment variables
  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const edgeConfigToken = process.env.EDGE_CONFIG_TOKEN;

  if (!edgeConfigId || !edgeConfigToken) {
    console.error("❌ Error: Missing required environment variables");
    console.error("");
    console.error("Please set the following environment variables:");
    console.error(
      "  EDGE_CONFIG_ID     - Your Edge Config ID from Vercel Dashboard",
    );
    console.error("  EDGE_CONFIG_TOKEN  - Your Edge Config write token");
    console.error("");
    console.error("Example:");
    console.error(
      '  EDGE_CONFIG_ID="ecfg_xxx" EDGE_CONFIG_TOKEN="xxx" npx tsx scripts/migrate-to-edge-config.ts',
    );
    process.exit(1);
  }

  console.log("📦 Reading local JSON files...\n");

  // Read local JSON files from public/content/
  const contentDir = join(process.cwd(), "public", "content");

  let menu: MenuContent;
  let projects: ProjectsContent;
  let about: AboutContent;
  let contact: ContactContent;

  try {
    const menuPath = join(contentDir, "menu-page.json");
    menu = JSON.parse(readFileSync(menuPath, "utf-8"));
    console.log("  ✓ menu-page.json loaded");
  } catch (error) {
    console.error("  ✗ Failed to read menu-page.json:", error);
    process.exit(1);
  }

  try {
    const projectsPath = join(contentDir, "projects-page.json");
    projects = JSON.parse(readFileSync(projectsPath, "utf-8"));
    console.log("  ✓ projects-page.json loaded");
    console.log(`    - Page header: "${projects.pageHeader.title}"`);
    console.log(`    - ${projects.projects.length} projects found`);
  } catch (error) {
    console.error("  ✗ Failed to read projects-page.json:", error);
    process.exit(1);
  }

  try {
    const aboutPath = join(contentDir, "about-page.json");
    about = JSON.parse(readFileSync(aboutPath, "utf-8"));
    console.log("  ✓ about-page.json loaded");
    console.log(`    - Page header: "${about.pageHeader.title}"`);
  } catch (error) {
    console.error("  ✗ Failed to read about-page.json:", error);
    process.exit(1);
  }

  try {
    const contactPath = join(contentDir, "contact-page.json");
    contact = JSON.parse(readFileSync(contactPath, "utf-8"));
    console.log("  ✓ contact-page.json loaded");
    console.log(`    - Page header: "${contact.pageHeader.title}"`);
  } catch (error) {
    console.error("  ✗ Failed to read contact-page.json:", error);
    process.exit(1);
  }

  console.log("\n🚀 Uploading to Edge Config...\n");

  // Prepare the items to update
  const items = [
    { operation: "upsert", key: "menu", value: menu },
    { operation: "upsert", key: "projects", value: projects },
    { operation: "upsert", key: "about", value: about },
    { operation: "upsert", key: "contact", value: contact },
    { operation: "upsert", key: "icons", value: { icons: [] } }, // Empty icons array, to be populated later
  ];

  try {
    const response = await fetch(`${EDGE_CONFIG_API}/${edgeConfigId}/items`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${edgeConfigToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log("  ✓ menu uploaded");
    console.log("  ✓ projects uploaded (with pageHeader)");
    console.log("  ✓ about uploaded (with pageHeader)");
    console.log("  ✓ contact uploaded (with pageHeader)");
    console.log("  ✓ icons placeholder created");

    console.log("\n✅ Migration complete!\n");
    console.log("Your content is now available in Edge Config.");
    console.log("");
    console.log("Content structure:");
    console.log("  - menu: profile, navigation, externalLinks, footer");
    console.log("  - projects: pageHeader + projects array");
    console.log("  - about: pageHeader + intro, skills, contact sections");
    console.log("  - contact: pageHeader + sections (email, connect)");
    console.log("  - icons: placeholder for dynamic icon loading");
    console.log("");
    console.log("Next steps:");
    console.log(
      "1. Add EDGE_CONFIG to your Vercel project environment variables",
    );
    console.log(
      "   (Vercel automatically sets this when you connect Edge Config to your project)",
    );
    console.log("");
    console.log("2. Deploy your project to Vercel");
    console.log("");
    console.log("3. To update content in the future, either:");
    console.log("   - Edit via Vercel Dashboard > Storage > Edge Config");
    console.log("   - Run this script again after editing local JSON files");
    console.log("   - Use the Vercel API to update programmatically");

    return result;
  } catch (error) {
    console.error("  ✗ Failed to upload to Edge Config:", error);
    process.exit(1);
  }
}

// Run the migration
main().catch(console.error);
