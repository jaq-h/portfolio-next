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

  // Menu
  "icon-html": "html",

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
const uiIcons = ["github", "linkedin", "link", "youtube", "html"];

export default function Icon({ icon, variant = "tech" }: IconProps) {
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
      className="inline-block mr-1 align-middle"
    />
  );
}
