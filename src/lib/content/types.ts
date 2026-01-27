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

// Page header content shared across pages
export interface PageHeader {
  title: string;
  subtitle: string;
  icon: string;
}

// About page content structure
export interface AboutIntro {
  heading: string;
  text: string;
}

export interface AboutSkills {
  heading: string;
  items: string[];
}

export interface AboutContact {
  heading: string;
  text: string;
}

export interface AboutContent {
  pageHeader: PageHeader;
  intro: AboutIntro;
  skills: AboutSkills;
  contact: AboutContact;
}

// Projects page content structure
export interface ProjectsContent {
  pageHeader: PageHeader;
  projects: Project[];
}

// Contact page content structure
export interface ContactSection {
  heading: string;
  description?: string;
}

export interface ContactSections {
  email: ContactSection;
  connect: ContactSection;
}

export interface ContactContent {
  pageHeader: PageHeader;
  sections: ContactSections;
}
