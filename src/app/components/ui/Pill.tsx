type PillProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Pill({ children, className = "" }: PillProps) {
  return (
    <span
      className={`px-3 py-2 bg-slate-900 border-2 border-slate-600 text-gray-200 rounded-md text-sm ${className}`}
    >
      {children}
    </span>
  );
}
