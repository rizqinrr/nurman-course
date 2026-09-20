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
      ? "chip-active-pulse border border-[#4a70a9] bg-[#4a70a9] text-white shadow-[0_8px_20px_rgba(74,112,169,0.22)]"
      : "border border-[#4a70a9] bg-[#4a70a9] text-white shadow-lg shadow-[#4a70a9]/30 hover:shadow-xl hover:shadow-[#4a70a9]/40";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isActive}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 active:scale-95 whitespace-nowrap ${
        isActive
          ? activeClass
          : "border border-[#c4d3e3] bg-white/75 text-[#536781] hover:border-[#4a70a9] hover:bg-white hover:text-[#294568]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className || ""}`}
    >
      {children ?? label}
    </button>
  );
}
