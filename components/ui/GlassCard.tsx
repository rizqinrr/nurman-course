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
      className={`backdrop-blur-xl bg-white/50 border border-white/70 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 pointer-events-auto ${
        onClick ? "cursor-pointer hover:bg-white/65 hover:border-white/80" : ""
      } ${className || ""}`}
    >
      {children}
    </div>
  );
}
