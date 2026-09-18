export function AccessBadge({ access }: { access: "public" | "login" | "purchase" }) {
  const label = access === "public" ? "Publik" : access === "login" ? "Login gratis" : "Berbayar";
  return <span className="inline-flex items-center rounded-full border border-[#acd0be] bg-[#e0f0e7] px-3 py-1 text-xs font-extrabold text-[#0e4d45]">{label}</span>;
}
