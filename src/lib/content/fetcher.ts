import { createClient } from "@vercel/edge-config";
import { readFileSync } from "fs";
import { join } from "path";
import type { MenuContent, ProjectsContent, IconsContent } from "./types";

// Create Edge Config client if connection string is available
const edgeConfig = process.env.EDGE_CONFIG
  ? createClient(process.env.EDGE_CONFIG)
  : null;

// ISR revalidation time in seconds
// Content will be refreshed in the background after this time
export const REVALIDATE_SECONDS = 60;

// Keys used in Edge Config
const EDGE_CONFIG_KEYS = {
  menu: "menu",
  projects: "projects",
  icons: "icons",
} as const;

/**
 * Read local JSON file from public directory
 * Works during build time when fetch is not available
 */
function readLocalJson<T>(filename: string): T {
  try {
    const filePath = join(process.cwd(), "public", filename);
    const fileContents = readFileSync(filePath, "utf-8");
    return JSON.parse(fileContents) as T;
  } catch (error) {
    console.error(`Error reading local file ${filename}:`, error);
    throw error;
  }
}

/**
 * Fetch menu content from Edge Config with local fallback
 */
export async function getMenuContent(): Promise<MenuContent> {
  try {
    if (edgeConfig) {
      const menu = await edgeConfig.get<MenuContent>(EDGE_CONFIG_KEYS.menu);
      if (menu) {
        return menu;
      }
    }
    // Fallback to local JSON
    return readLocalJson<MenuContent>("menu.json");
  } catch (error) {
    console.error("Error fetching menu content:", error);
    return getFallbackMenu();
  }
}

/**
 * Fetch projects content from Edge Config with local fallback
 */
export async function getProjectsContent(): Promise<ProjectsContent> {
  try {
    if (edgeConfig) {
      const projects = await edgeConfig.get<ProjectsContent>(
        EDGE_CONFIG_KEYS.projects,
      );
      if (projects) {
        return projects;
      }
    }
    // Fallback to local JSON
    return readLocalJson<ProjectsContent>("projects.json");
  } catch (error) {
    console.error("Error fetching projects content:", error);
    return { projects: [] };
  }
}

/**
 * Fetch icons content from Edge Config with local fallback
 * Icons can be stored in Edge Config with Vercel Blob URLs
 */
export async function getIconsContent(): Promise<IconsContent> {
  try {
    if (edgeConfig) {
      const icons = await edgeConfig.get<IconsContent>(EDGE_CONFIG_KEYS.icons);
      if (icons) {
        return icons;
      }
    }
    // Fallback: return empty, components will use local SVGs
    return { icons: [] };
  } catch (error) {
    console.error("Error fetching icons content:", error);
    return { icons: [] };
  }
}

/**
 * Fetch all content in a single call (more efficient)
 */
export async function getAllContent(): Promise<{
  menu: MenuContent;
  projects: ProjectsContent;
  icons: IconsContent;
}> {
  try {
    if (edgeConfig) {
      // Fetch all keys in parallel from Edge Config
      const [menu, projects, icons] = await Promise.all([
        edgeConfig.get<MenuContent>(EDGE_CONFIG_KEYS.menu),
        edgeConfig.get<ProjectsContent>(EDGE_CONFIG_KEYS.projects),
        edgeConfig.get<IconsContent>(EDGE_CONFIG_KEYS.icons),
      ]);

      return {
        menu: menu || readLocalJson<MenuContent>("menu.json"),
        projects: projects || readLocalJson<ProjectsContent>("projects.json"),
        icons: icons || { icons: [] },
      };
    }

    // Fallback to local JSON files
    return {
      menu: readLocalJson<MenuContent>("menu.json"),
      projects: readLocalJson<ProjectsContent>("projects.json"),
      icons: { icons: [] },
    };
  } catch (error) {
    console.error("Error fetching all content:", error);
    return {
      menu: getFallbackMenu(),
      projects: { projects: [] },
      icons: { icons: [] },
    };
  }
}

/**
 * Fallback menu content when all else fails
 */
function getFallbackMenu(): MenuContent {
  return {
    profile: {
      name: "Jacques Hebert",
      title: "Software Developer",
      image: "/bugs.png",
    },
    navigation: [
      { title: "About", path: "/about", icon: "user" },
      { title: "Projects", path: "/projects", icon: "folder" },
      { title: "Contact", path: "/contact", icon: "mail" },
    ],
    externalLinks: [
      { title: "GitHub", url: "https://github.com/jaq-h", icon: "github" },
      {
        title: "LinkedIn",
        url: "https://www.linkedin.com/in/jaq-h/",
        icon: "linkedin",
      },
      { title: "Resume", url: "/resume.pdf", icon: "document", download: true },
    ],
    footer: {
      copyright: "© 2024 Jacques Hebert",
    },
  };
}
