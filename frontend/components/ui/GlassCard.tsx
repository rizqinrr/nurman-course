interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-[#cbd8e5] bg-white shadow-[0_1px_2px_rgba(20,35,58,0.04)] transition-[border-color,box-shadow,background-color] duration-200 ${
        onClick ? "cursor-pointer hover:border-[#8da9c4] hover:bg-[#fbfdff] hover:shadow-[0_8px_24px_rgba(20,35,58,0.08)]" : ""
      } ${className || ""}`}
    >
      {children}
    </div>
  );
}
