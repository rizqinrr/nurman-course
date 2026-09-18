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
        h1: ({ children: value }) => <h2 id={headingId(textContent(value))} className="mt-12 scroll-mt-24 font-playfair text-3xl leading-tight text-[#17283e] first:mt-0">{value}</h2>,
        h2: ({ children: value }) => <h2 id={headingId(textContent(value))} className="mt-12 scroll-mt-24 font-playfair text-3xl leading-tight text-[#17283e]">{value}</h2>,
        h3: ({ children: value }) => <h3 id={headingId(textContent(value))} className="mt-9 scroll-mt-24 text-xl font-bold text-[#223b5d]">{value}</h3>,
        p: ({ children: value }) => <p className="mt-5 text-[1.03rem] leading-8 text-[#3f4b46]">{value}</p>,
        ul: ({ children: value }) => <ul className="mt-5 list-disc space-y-2 pl-6 text-[1.03rem] leading-8 text-[#3f4b46]">{value}</ul>,
        ol: ({ children: value }) => <ol className="mt-5 list-decimal space-y-2 pl-6 text-[1.03rem] leading-8 text-[#3f4b46]">{value}</ol>,
        blockquote: ({ children: value }) => <blockquote className="my-7 border-l border-[#4a70a9] bg-[#eef2f6] px-5 py-4 text-[#334960]">{value}</blockquote>,
        a: ({ href, children: value }) => {
          const external = href?.startsWith("http://") || href?.startsWith("https://");
          return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer noopener" : undefined} className="font-semibold text-[#294d7e] underline decoration-[#8fa6c1] underline-offset-4 hover:decoration-[#294d7e]">{value}</a>;
        },
        code: ({ children: value }) => <code className="rounded bg-[#e7e2d9] px-1.5 py-0.5 font-mono text-sm text-[#243650]">{value}</code>,
        pre: ({ children: value }) => <pre className="my-7 overflow-x-auto rounded-lg bg-[#17283e] p-5 text-sm leading-6 text-[#edf2f7]">{value}</pre>,
        table: ({ children: value }) => <div className="my-7 overflow-x-auto"><table className="w-full border-collapse text-left text-sm">{value}</table></div>,
        th: ({ children: value }) => <th className="border-b border-[#9fb1c7] bg-[#e9eef5] px-3 py-2 font-bold text-[#223b5d]">{value}</th>,
        td: ({ children: value }) => <td className="border-b border-[#ded7cc] px-3 py-2 text-[#46534d]">{value}</td>,
        img: () => null,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
