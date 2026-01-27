import { ReactNode } from "react";
import Icon from "@/app/components/media/Icon";

type PageContainerProps = {
  title: string;
  subtitle?: string;
  icon?: string;
  children: ReactNode;
};

export default function PageContainer({
  title,
  subtitle,
  icon,
  children,
}: PageContainerProps) {
  return (
    <div className="p-6 md:p-10">
      {/* Page Header */}
      <header className="mb-10 pl-2 md:pl-7">
        <div className="flex items-start gap-4">
          {/* Optional Icon */}
          {icon && (
            <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-800 to-purple-950 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/30">
              <div className="scale-125 md:scale-150">
                <Icon icon={icon} variant="ui" />
              </div>
            </div>
          )}

          {/* Title and Subtitle */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {title}
              </h1>
              {/* Decorative accent line */}
              <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-purple-800/50 to-transparent max-w-32" />
            </div>

            {subtitle && (
              <p className="mt-2 text-gray-400 text-base md:text-lg max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Bottom decorative border */}
        <div className="mt-6 h-px bg-gradient-to-r from-purple-800/30 via-purple-600/20 to-transparent" />
      </header>

      {/* Page Content */}
      <div className="space-y-8">{children}</div>
    </div>
  );
}
