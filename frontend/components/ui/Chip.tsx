interface ChipProps {
  label?: string;
  active?: boolean;
  selected?: boolean;
  /** green = default + pulse; blue = selected non-default (shadow only) */
  activeTone?: "green" | "blue";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function Chip({
  label,
  active,
  selected,
  activeTone = "blue",
  onClick,
  disabled = false,
  className,
  children,
}: ChipProps) {
  const isActive = selected ?? active ?? false;

  const activeClass =
    activeTone === "green"
      ? "chip-active-pulse border border-green-600 bg-green-600 text-white shadow-lg shadow-green-600/35"
      : "border border-[#4a70a9] bg-[#4a70a9] text-white shadow-lg shadow-[#4a70a9]/30 hover:shadow-xl hover:shadow-[#4a70a9]/40";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 active:scale-95 whitespace-nowrap ${
        isActive
          ? activeClass
          : "bg-white/40 backdrop-blur-sm border border-white/60 text-gray-700 hover:bg-white/60 hover:border-white/80 hover:shadow-md"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className || ""}`}
    >
      {children ?? label}
    </button>
  );
}
