import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from "@/lib/utils";

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  return (
    <div className={cn("prose-custom", className)}>
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="rounded-lg overflow-hidden my-6 shadow-md border border-border/50">
                <div className="bg-[#1e1e1e] px-4 py-1 text-xs text-white/50 border-b border-white/10 font-mono flex justify-between">
                  <span>{match[1]}</span>
                  <span>Copy</span>
                </div>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, borderRadius: 0 }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          h1: ({ children }) => <h1 className="text-4xl mb-6 mt-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl mt-8 mb-4 border-b border-border pb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl mt-6 mb-3 font-semibold">{children}</h3>,
          p: ({ children }) => <p className="mb-4 text-foreground/80 leading-7">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent/50 pl-4 py-1 italic bg-secondary/50 rounded-r-lg my-6 text-foreground/70">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-accent hover:underline font-medium" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
