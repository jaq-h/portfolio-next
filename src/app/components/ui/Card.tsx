import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <section
      className={`bg-slate-800 border-2 border-slate-600 max-w-screen-xl rounded-xl py-5 lg:py-6 px-5 lg:px-7 ${className}`}
    >
      {children}
    </section>
  );
}
