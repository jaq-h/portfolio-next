import { createClient } from "@vercel/edge-config";
import { readFileSync } from "fs";
import { join } from "path";
import type {
  MenuContent,
  ProjectsContent,
  IconsContent,
  AboutContent,
  ContactContent,
} from "./types";

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
  about: "about",
  contact: "contact",
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
    return readLocalJson<MenuContent>("content/menu-page.json");
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
    return readLocalJson<ProjectsContent>("content/projects-page.json");
  } catch (error) {
    console.error("Error fetching projects content:", error);
    return getFallbackProjects();
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
 * Fetch about content from Edge Config with local fallback
 */
export async function getAboutContent(): Promise<AboutContent> {
  try {
    if (edgeConfig) {
      const about = await edgeConfig.get<AboutContent>(EDGE_CONFIG_KEYS.about);
      if (about) {
        return about;
      }
    }
    // Fallback to local JSON
    return readLocalJson<AboutContent>("content/about-page.json");
  } catch (error) {
    console.error("Error fetching about content:", error);
    return getFallbackAbout();
  }
}

/**
 * Fetch contact content from Edge Config with local fallback
 */
export async function getContactContent(): Promise<ContactContent> {
  try {
    if (edgeConfig) {
      const contact = await edgeConfig.get<ContactContent>(
        EDGE_CONFIG_KEYS.contact,
      );
      if (contact) {
        return contact;
      }
    }
    // Fallback to local JSON
    return readLocalJson<ContactContent>("content/contact-page.json");
  } catch (error) {
    console.error("Error fetching contact content:", error);
    return getFallbackContact();
  }
}

/**
 * Fetch all content in a single call (more efficient)
 */
export async function getAllContent(): Promise<{
  menu: MenuContent;
  projects: ProjectsContent;
  icons: IconsContent;
  about: AboutContent;
  contact: ContactContent;
}> {
  try {
    if (edgeConfig) {
      // Fetch all keys in parallel from Edge Config
      const [menu, projects, icons, about, contact] = await Promise.all([
        edgeConfig.get<MenuContent>(EDGE_CONFIG_KEYS.menu),
        edgeConfig.get<ProjectsContent>(EDGE_CONFIG_KEYS.projects),
        edgeConfig.get<IconsContent>(EDGE_CONFIG_KEYS.icons),
        edgeConfig.get<AboutContent>(EDGE_CONFIG_KEYS.about),
        edgeConfig.get<ContactContent>(EDGE_CONFIG_KEYS.contact),
      ]);

      return {
        menu: menu || readLocalJson<MenuContent>("content/menu-page.json"),
        projects:
          projects ||
          readLocalJson<ProjectsContent>("content/projects-page.json"),
        icons: icons || { icons: [] },
        about: about || readLocalJson<AboutContent>("content/about-page.json"),
        contact:
          contact || readLocalJson<ContactContent>("content/contact-page.json"),
      };
    }

    // Fallback to local JSON files
    return {
      menu: readLocalJson<MenuContent>("content/menu-page.json"),
      projects: readLocalJson<ProjectsContent>("content/projects-page.json"),
      icons: { icons: [] },
      about: readLocalJson<AboutContent>("content/about-page.json"),
      contact: readLocalJson<ContactContent>("content/contact-page.json"),
    };
  } catch (error) {
    console.error("Error fetching all content:", error);
    return {
      menu: getFallbackMenu(),
      projects: getFallbackProjects(),
      icons: { icons: [] },
      about: getFallbackAbout(),
      contact: getFallbackContact(),
    };
  }
}

/**
 * Fallback about content when all else fails
 */
function getFallbackAbout(): AboutContent {
  return {
    pageHeader: {
      title: "About Me",
      subtitle:
        "Software developer passionate about building modern web applications",
      icon: "user",
    },
    intro: {
      heading: "Hello, I'm Jacques Hebert",
      text: "I'm a software developer passionate about building modern web applications and exploring new technologies. I enjoy working with TypeScript, React, Rust, and creating tools that solve real problems.",
    },
    skills: {
      heading: "Skills",
      items: [
        "TypeScript",
        "JavaScript",
        "React",
        "Next.js",
        "Rust",
        "Tauri",
        "Node.js",
        "PostgreSQL",
        "TailwindCSS",
        "Git",
      ],
    },
    contact: {
      heading: "Get In Touch",
      text: "Feel free to reach out through GitHub or LinkedIn. I'm always interested in collaborating on interesting projects or discussing new opportunities.",
    },
  };
}

/**
 * Fallback projects content when all else fails
 */
function getFallbackProjects(): ProjectsContent {
  return {
    pageHeader: {
      title: "Technical Projects",
      subtitle:
        "A collection of my work showcasing various technologies and problem-solving approaches",
      icon: "folder",
    },
    projects: [],
  };
}

/**
 * Fallback contact content when all else fails
 */
function getFallbackContact(): ContactContent {
  return {
    pageHeader: {
      title: "Contact",
      subtitle:
        "Get in touch — I'm always open to new opportunities and collaborations",
      icon: "mail",
    },
    sections: {
      email: {
        heading: "Get My Email Address",
        description:
          "To protect against spam and bots, please verify you're human to reveal my email address.",
      },
      connect: {
        heading: "Other Ways to Connect",
      },
    },
  };
}

/**
 * Fallback menu content when all else fails
 */
function getFallbackMenu(): MenuContent {
  return {
    profile: {
      name: "Jacques Hebert",
      title: "Software Developer",
      image: "/profile.svg",
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
