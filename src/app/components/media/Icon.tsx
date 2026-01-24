import Image from "next/image";

type IconProps = {
  icon: string;
  variant?: "tech" | "ui";
};

// Map old Semantic UI icon names to new SVG file names
const iconMap: Record<string, string> = {
  // Social/Links
  github: "github",
  linkedin: "linkedin",
  link: "link",
  linkify: "link",
  youtube: "youtube",
  spotify: "spotify",

  // Menu/Navigation
  "icon-html": "html",
  user: "user",
  folder: "folder",
  menu: "menu",
  close: "close",
  mail: "mail",
  document: "document",

  // Languages
  javascript: "javascript",
  "js square": "javascript",
  typescript: "typescript",
  "file alternate": "cpp",
  cpp: "cpp",
  cog: "rust",
  rust: "rust",

  // Frameworks/Libraries
  react: "react",
  "icon-reactjs": "react",
  tauri: "tauri",
  threejs: "threejs",
  "paint brush": "tailwind",
  tailwind: "tailwind",
  asterisk: "p5js",
  p5js: "p5js",

  // APIs/Services
  bitcoin: "crypto",
  crypto: "crypto",

  // Build Tools/Deployment
  bolt: "bolt",
  vite: "bolt",
  server: "server",
  vercel: "server",

  // Databases
  "icon-postgres": "postgres",
  postgres: "postgres",

  // UI Libraries
  edit: "semanticui",
  semanticui: "semanticui",
  "sliders horizontal": "materialui",
  materialui: "materialui",
};

// Icons available in UI variant (white/grey)
const uiIcons = [
  "github",
  "linkedin",
  "link",
  "youtube",
  "html",
  "user",
  "folder",
  "menu",
  "close",
  "mail",
  "document",
];

export default function Icon({ icon, variant = "tech" }: IconProps) {
  // Check if icon is a full URL (e.g., from Vercel Blob)
  const isExternalUrl =
    icon.startsWith("http://") || icon.startsWith("https://");

  if (isExternalUrl) {
    return (
      <Image
        src={icon}
        alt="icon"
        width={16}
        height={16}
        className="inline-block align-middle"
      />
    );
  }

  const svgName = iconMap[icon];

  if (!svgName) {
    console.warn(`Unknown icon: ${icon}`);
    return null;
  }

  // Use UI variant if requested and available, otherwise fall back to tech
  const useUiVariant = variant === "ui" && uiIcons.includes(svgName);
  const iconPath = useUiVariant
    ? `/icons/ui/${svgName}.svg`
    : `/icons/${svgName}.svg`;

  return (
    <Image
      src={iconPath}
      alt={`${icon} icon`}
      width={16}
      height={16}
      className="inline-block align-middle"
    />
  );
}
