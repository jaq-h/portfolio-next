"use client";

import { createContext, useContext, ReactNode } from "react";
import type {
  MenuContent,
  ProjectsContent,
  IconsContent,
  AboutContent,
  ContactContent,
  PageHeader,
  ExternalLink,
  NavLink,
  Project,
  IconDefinition,
} from "./types";

/**
 * Combined content context value
 */
interface ContentContextValue {
  menu: MenuContent;
  projects: ProjectsContent;
  icons: IconsContent;
  about: AboutContent;
  contact: ContactContent;
}

/**
 * Context for sharing site content across the app
 * Content is fetched server-side and passed to provider
 */
const ContentContext = createContext<ContentContextValue | null>(null);

/**
 * Props for the ContentProvider component
 */
interface ContentProviderProps {
  children: ReactNode;
  menu: MenuContent;
  projects: ProjectsContent;
  icons: IconsContent;
  about: AboutContent;
  contact: ContactContent;
}

/**
 * Provider component that makes content available to all children
 * Content is passed as props (fetched server-side in layout)
 * This prevents prop drilling and allows any component to access content
 */
export function ContentProvider({
  children,
  menu,
  projects,
  icons,
  about,
  contact,
}: ContentProviderProps) {
  return (
    <ContentContext.Provider value={{ menu, projects, icons, about, contact }}>
      {children}
    </ContentContext.Provider>
  );
}

/**
 * Base hook to access all content
 * Throws if used outside of ContentProvider
 */
function useContent(): ContentContextValue {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error(
      "Content hooks must be used within a ContentProvider. " +
        "Make sure your component is wrapped in the provider (usually in layout.tsx).",
    );
  }
  return context;
}

/**
 * Hook to access menu content (profile, navigation, external links, footer)
 */
export function useMenuContent(): MenuContent {
  return useContent().menu;
}

/**
 * Hook to access navigation links only
 */
export function useNavigation(): NavLink[] {
  return useContent().menu.navigation;
}

/**
 * Hook to access external links only (GitHub, LinkedIn, Resume, etc.)
 */
export function useExternalLinks(): ExternalLink[] {
  return useContent().menu.externalLinks;
}

/**
 * Hook to access projects content (including pageHeader)
 */
export function useProjectsContent(): ProjectsContent {
  return useContent().projects;
}

/**
 * Hook to access projects array directly
 */
export function useProjects(): Project[] {
  return useContent().projects.projects;
}

/**
 * Hook to access projects page header
 */
export function useProjectsHeader(): PageHeader {
  return useContent().projects.pageHeader;
}

/**
 * Hook to access icons content for dynamic icon loading
 */
export function useIconsContent(): IconsContent {
  return useContent().icons;
}

/**
 * Hook to find a specific icon by name and variant
 * Returns undefined if not found (component should fallback to local SVG)
 */
export function useIcon(
  name: string,
  variant: "ui" | "tech" = "tech",
): IconDefinition | undefined {
  const { icons } = useContent().icons;
  return icons.find((icon) => icon.name === name && icon.variant === variant);
}

/**
 * Hook to access profile information
 */
export function useProfile() {
  return useContent().menu.profile;
}

/**
 * Hook to access footer content
 */
export function useFooter() {
  return useContent().menu.footer;
}

/**
 * Hook to access about content (including pageHeader)
 */
export function useAboutContent(): AboutContent {
  return useContent().about;
}

/**
 * Hook to access about page header
 */
export function useAboutHeader(): PageHeader {
  return useContent().about.pageHeader;
}

/**
 * Hook to access contact content (including pageHeader)
 */
export function useContactContent(): ContactContent {
  return useContent().contact;
}

/**
 * Hook to access contact page header
 */
export function useContactHeader(): PageHeader {
  return useContent().contact.pageHeader;
}
