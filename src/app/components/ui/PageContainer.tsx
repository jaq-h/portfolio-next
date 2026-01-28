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
      <header className="lg:px-7 py-5 px-5 max-w-screen-xl mb-10 bg-slate-950 border-2 border-purple-900/80 rounded-xl ">
        <div className="flex items-center gap-4">
          {/* Optional Icon */}
          {icon && (
            <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-purple-900/80 rounded-xl flex items-center justify-center">
              <div className="scale-125 md:scale-150">
                <Icon icon={icon} variant="ui" />
              </div>
            </div>
          )}

          {/* Title and Subtitle */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {title}
            </h1>

            {/*{subtitle && (
              <p className="mt-2 text-gray-400 text-base md:text-lg max-w-2xl">
                {subtitle}
              </p>
            )}*/}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="space-y-8">{children}</div>
    </div>
  );
}
