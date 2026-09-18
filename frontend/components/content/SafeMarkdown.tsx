import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export function headingId(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function textContent(children: React.ReactNode): string {
  return Array.isArray(children) ? children.map(textContent).join("") : typeof children === "string" ? children : "";
}

export default function SafeMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      skipHtml
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      urlTransform={defaultUrlTransform}
      components={{
        h1: ({ children: value }) => <h2 id={headingId(textContent(value))} className="mt-12 scroll-mt-24 font-display text-3xl font-extrabold leading-tight tracking-[-0.045em] text-[#102d2b] first:mt-0">{value}</h2>,
        h2: ({ children: value }) => <h2 id={headingId(textContent(value))} className="mt-12 scroll-mt-24 font-display text-3xl font-extrabold leading-tight tracking-[-0.045em] text-[#102d2b]">{value}</h2>,
        h3: ({ children: value }) => <h3 id={headingId(textContent(value))} className="mt-9 scroll-mt-24 font-display text-xl font-extrabold tracking-[-0.02em] text-[#0e4d45]">{value}</h3>,
        p: ({ children: value }) => <p className="mt-5 text-[1.03rem] leading-8 text-[#3f4b46]">{value}</p>,
        ul: ({ children: value }) => <ul className="mt-5 list-disc space-y-2 pl-6 text-[1.03rem] leading-8 text-[#3f4b46] marker:text-[#f0752d]">{value}</ul>,
        ol: ({ children: value }) => <ol className="mt-5 list-decimal space-y-2 pl-6 text-[1.03rem] leading-8 text-[#3f4b46] marker:text-[#f0752d]">{value}</ol>,
        blockquote: ({ children: value }) => <blockquote className="my-7 rounded-r-2xl border-y border-r border-[#f6bd87] bg-[#fff0df] px-5 py-4 text-sm leading-7 text-[#6b4a2f]">{value}</blockquote>,
        a: ({ href, children: value }) => {
          const external = href?.startsWith("http://") || href?.startsWith("https://");
          return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer noopener" : undefined} className="font-semibold text-[#0e4d45] underline decoration-[#f0752d] decoration-2 underline-offset-4 hover:decoration-[#0e4d45]">{value}</a>;
        },
        code: ({ children: value }) => <code className="rounded-md bg-[#e2ddcf] px-1.5 py-0.5 font-mono text-[0.85em] text-[#0e4d45]">{value}</code>,
        pre: ({ children: value }) => <pre className="my-7 overflow-x-auto rounded-2xl border-2 border-[#0e4d45] bg-[#0f3b35] p-5 font-mono text-sm leading-6 text-[#edf7ef] shadow-[0_3px_0_#082e2a]">{value}</pre>,
        table: ({ children: value }) => <div className="my-7 overflow-x-auto"><table className="w-full border-collapse text-left text-sm">{value}</table></div>,
        th: ({ children: value }) => <th className="border-b-2 border-[#cdd9cd] bg-[#e0f0e7] px-3 py-2 font-bold text-[#102d2b]">{value}</th>,
        td: ({ children: value }) => <td className="border-b border-[#e2ddcf] px-3 py-2 text-[#46534d]">{value}</td>,
        img: () => null,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
