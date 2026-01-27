import { ReactNode } from "react";

type PageContainerProps = {
  title: string;
  children: ReactNode;
};

export default function PageContainer({ title, children }: PageContainerProps) {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-white pl-7 mb-8">{title}</h1>
      <div className="space-y-8">{children}</div>
    </div>
  );
}
