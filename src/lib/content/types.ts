// Content types shared across the application
// These match the structure stored in Vercel Edge Config

export interface NavLink {
  title: string;
  path: string;
  icon: string;
}

export interface ExternalLink {
  title: string;
  url: string;
  icon: string;
  download?: boolean;
}

export interface Profile {
  name: string;
  title: string;
  image: string; // Vercel Blob URL or local path
}

export interface MenuContent {
  profile: Profile;
  navigation: NavLink[];
  externalLinks: ExternalLink[];
  footer: {
    copyright: string;
  };
}

export interface TechStack {
  name: string;
  icon: string;
}

export interface ProjectLink {
  title: string;
  icon: string;
  link: string;
}

export interface ProjectMedia {
  mediaType: "image" | "video" | "iframe";
  mediaSrc: string; // Vercel Blob URL or local path
}

export interface Project {
  title: string;
  description: string;
  projectLinks: ProjectLink[];
  projectMedia: ProjectMedia;
  techStack: TechStack[];
}

export interface ProjectsContent {
  projects: Project[];
}

// Combined site content structure stored in Edge Config
export interface SiteContent {
  menu: MenuContent;
  projects: ProjectsContent;
}

// Icon definition for dynamic icon loading
export interface IconDefinition {
  name: string;
  variant: "ui" | "tech";
  url: string; // Vercel Blob URL
}

export interface IconsContent {
  icons: IconDefinition[];
}
