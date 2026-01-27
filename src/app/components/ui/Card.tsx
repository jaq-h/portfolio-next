import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <section
      className={`bg-slate-800 border-2 border-purple-800/50 rounded-xl p-7 ${className}`}
    >
      {children}
    </section>
  );
}
