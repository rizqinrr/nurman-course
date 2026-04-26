interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-medium rounded-xl transition-all duration-300 font-sans shadow-md";

  const variants = {
    primary:
      "bg-[#4a70a9] text-white hover:bg-[#3a5a99] hover:shadow-lg active:scale-95 active:shadow-md",
    secondary:
      "bg-[#cbcbcb] text-gray-900 hover:bg-[#b0b0b0] hover:shadow-lg active:scale-95 active:shadow-md",
    ghost:
      "bg-white/40 backdrop-blur-sm border border-white/60 text-gray-700 hover:bg-white/60 hover:border-white/80 hover:shadow-md transition-all",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
