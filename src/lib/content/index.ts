// Content management utilities
// Centralized exports for Edge Config + Vercel Blob content system

// Types
export type {
  NavLink,
  ExternalLink,
  Profile,
  MenuContent,
  TechStack,
  ProjectLink,
  ProjectMedia,
  Project,
  ProjectsContent,
  SiteContent,
  IconDefinition,
  IconsContent,
  PageHeader,
  AboutContent,
  AboutIntro,
  AboutSkills,
  AboutContact,
  ContactContent,
  ContactSection,
  ContactSections,
} from "./types";

// Fetcher functions (server-side)
export {
  getMenuContent,
  getProjectsContent,
  getIconsContent,
  getAboutContent,
  getContactContent,
  getAllContent,
  REVALIDATE_SECONDS,
} from "./fetcher";

// React Context provider and hooks (client-side)
export {
  ContentProvider,
  useMenuContent,
  useNavigation,
  useExternalLinks,
  useProjectsContent,
  useProjects,
  useIconsContent,
  useIcon,
  useProfile,
  useFooter,
  useAboutContent,
  useContactContent,
} from "./provider";
