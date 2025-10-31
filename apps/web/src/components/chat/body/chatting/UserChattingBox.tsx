import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

type UserChattingBoxProps = {
  message: {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
  };
};

const UserChattingBox = ({ message }: UserChattingBoxProps) => {
  if (!message.isUser) return null;
  
  // 링크 클릭 방지 (상위 레벨 방어)
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.closest('a')) {
      e.preventDefault();
      e.stopPropagation();
      console.log('[UserChattingBox] 상위에서 링크 클릭 차단');
    }
  };
  
  return (
    <div className="max-w-[80%] group" onClick={handleClick}>
      <div
        className="p-4 bg-primary-500 text-white rounded-2xl rounded-tr-sm shadow-lg 
                    transition-all duration-500 ease-out
                    hover:shadow-xl hover:shadow-primary-600/30
                    hover:bg-primary
                    hover:transform hover:scale-[1.02]
                    cursor-pointer"
      >
        <div className="prose prose-sm max-w-none prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;
                
                return !isInline ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus as any}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-md my-1.5 text-xs"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-primary-600 text-white px-1 py-0.5 rounded text-xs font-mono" {...rest}>
                    {children}
                  </code>
                );
              },
              a({ children, href, ...props }) {
                return (
                  <a 
                    href={href} 
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('[UserChattingBox] 링크 클릭 차단:', href);
                    }}
                    className="text-white underline hover:text-primary-100 cursor-default" 
                    {...props}
                  >
                    {children}
                  </a>
                );
              },
              h1({ children, ...props }) {
                return <h1 className="text-base font-bold text-white mt-2 mb-1" {...props}>{children}</h1>;
              },
              h2({ children, ...props }) {
                return <h2 className="text-sm font-semibold text-white mt-2 mb-1" {...props}>{children}</h2>;
              },
              h3({ children, ...props }) {
                return <h3 className="text-sm font-semibold text-white mt-1.5 mb-0.5" {...props}>{children}</h3>;
              },
              ul({ children, ...props }) {
                return <ul className="list-disc list-inside my-1 space-y-0.5 text-sm" {...props}>{children}</ul>;
              },
              ol({ children, ...props }) {
                return <ol className="list-decimal list-inside my-1 space-y-0.5 text-sm" {...props}>{children}</ol>;
              },
              blockquote({ children, ...props }) {
                return (
                  <blockquote className="border-l-2 border-white/50 pl-2 py-1 my-1 italic text-white/90 text-sm" {...props}>
                    {children}
                  </blockquote>
                );
              },
              table({ children, ...props }) {
                return (
                  <div className="overflow-x-auto my-1.5">
                    <table className="min-w-full border border-white/30 text-xs" {...props}>{children}</table>
                  </div>
                );
              },
              thead({ children, ...props }) {
                return <thead className="bg-primary-600" {...props}>{children}</thead>;
              },
              th({ children, ...props }) {
                return <th className="border border-white/30 px-2 py-1 text-left font-semibold" {...props}>{children}</th>;
              },
              td({ children, ...props }) {
                return <td className="border border-white/30 px-2 py-1" {...props}>{children}</td>;
              },
              p({ children, ...props }) {
                return <p className="my-1 text-white leading-relaxed text-sm" {...props}>{children}</p>;
              },
              hr({ ...props }) {
                return <hr className="my-2 border-white/30" {...props} />;
              },
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>
        <div className="mt-2 text-xs text-white/70 transition-colors duration-300 group-hover:text-white/90">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default UserChattingBox;
