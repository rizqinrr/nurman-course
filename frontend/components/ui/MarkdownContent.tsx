interface MarkdownContentProps {
  text: string;
  className?: string;
}

function renderInlineStyles(text: string) {
  const parts = text.split("**");
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-bold text-gray-800">{part}</strong>;
    }
    return part;
  });
}

export default function MarkdownContent({ text, className }: MarkdownContentProps) {
  const lines = text.split("\n");
  return (
    <div className={`space-y-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed text-left ${className || ""}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("# ")) {
          return null;
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h4 key={idx} className="font-bold text-gray-800 text-xs sm:text-sm mt-3 text-[#4a70a9] border-b border-[#4a70a9]/15 pb-1">
              {trimmed.replace("## ", "")}
            </h4>
          );
        }

        if (trimmed.startsWith("- ")) {
          const content = trimmed.replace("- ", "");
          return (
            <li key={idx} className="list-disc list-inside ml-2 text-gray-600">
              {renderInlineStyles(content)}
            </li>
          );
        }

        return (
          <p key={idx} className="text-gray-600">
            {renderInlineStyles(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
