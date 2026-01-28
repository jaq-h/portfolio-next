import Link from "next/link";
import Icon from "@/app/components/media/Icon";
import { ReactNode, MouseEventHandler } from "react";

type ButtonProps = {
  children: ReactNode;
  icon?: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  download?: boolean;
  external?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  title?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function Button({
  children,
  icon,
  href,
  onClick,
  download,
  external,
  disabled: disabledProp = false,
  type = "button",
  title,
  variant = "primary",
  size = "md",
  className = "",
}: ButtonProps) {
  // Button is disabled if explicitly disabled or if no action/link is provided
  const disabled = disabledProp || (!href && !onClick);
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2",
    lg: "px-6 py-3",
  };

  const variantClasses = {
    primary: disabled
      ? "bg-slate-600 text-slate-200"
      : "bg-slate-900 active:bg-slate-700 hover:border-purple-800/80 hover:bg-slate-950 border-2 border-slate-600",
    secondary: disabled
      ? "bg-slate-700 text-slate-200"
      : "bg-slate-700 hover:border-purple-800 active:bg-slate-800 border-2 border-slate-600",
  };

  const baseClassName =
    "group inline-flex items-center justify-center gap-2 rounded-md whitespace-nowrap transition-colors font-medium";

  const iconClassName = disabled
    ? ""
    : "group-hover:[filter:brightness(0)_saturate(100%)_invert(32%)_sepia(85%)_saturate(5000%)_hue-rotate(250deg)_brightness(95%)]";

  const fullClassName = `${baseClassName} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  const content = (
    <>
      {icon && <Icon icon={icon} variant="ui" className={iconClassName} />}
      <span>{children}</span>
    </>
  );

  // If href is provided, render as a link
  if (href) {
    const isExternal = external ?? href.startsWith("http");

    if (isExternal || download) {
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          download={download || undefined}
          className={fullClassName}
          title={title}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={fullClassName} title={title}>
        {content}
      </Link>
    );
  }

  // Otherwise render as a button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={fullClassName}
      title={title}
    >
      {content}
    </button>
  );
}
