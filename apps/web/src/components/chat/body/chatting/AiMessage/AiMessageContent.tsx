import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

type AiMessageContentProps = {
  text: string;
};

const AiMessageContent = ({ text }: AiMessageContentProps) => {
  const normalizeText = (raw: string): string => {
    let result = raw;

    // HTML 태그 제거 (span, em 등)
    result = result.replace(/<[^>]+>/g, '');

    return result;
  };

  const normalizedText = normalizeText(text);

  return (
    <div className="max-w-none prose prose-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;

            return !isInline ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-md my-1.5 text-xs"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                className="bg-primary-50 text-primary-700 px-1 py-0.5 rounded text-xs font-mono dark:bg-primary-950 dark:text-primary-200"
                {...rest}
              >
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
                }}
                className="underline cursor-default text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200"
                {...props}
              >
                {children}
              </a>
            );
          },
          h1({ children, ...props }) {
            return (
              <h1
                className="mt-2 mb-1 text-base font-bold text-primary-800 dark:text-primary-200"
                {...props}
              >
                {children}
              </h1>
            );
          },
          h2({ children, ...props }) {
            return (
              <h2
                className="mt-2 mb-1 text-sm font-semibold text-primary-700 dark:text-primary-200"
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3({ children, ...props }) {
            return (
              <h3
                className="text-sm font-semibold text-primary-600 mt-1.5 mb-0.5 dark:text-primary-200"
                {...props}
              >
                {children}
              </h3>
            );
          },
          ul({ children, ...props }) {
            return (
              <ul
                className="list-disc list-inside my-1 space-y-0.5 text-sm"
                {...props}
              >
                {children}
              </ul>
            );
          },
          ol({ children, ...props }) {
            return (
              <ol
                className="list-decimal list-inside my-1 space-y-0.5 text-sm"
                {...props}
              >
                {children}
              </ol>
            );
          },
          blockquote({ children, ...props }) {
            return (
              <blockquote
                className="py-1 pl-2 my-1 text-sm italic text-gray-700 border-l-2 border-primary-300 bg-primary-25 dark:text-neutral-100 dark:border-primary-800 dark:bg-neutral-900"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          table({ children, ...props }) {
            return (
              <div className="overflow-x-auto my-1.5">
                <table
                  className="min-w-full text-xs border border-gray-300 dark:border-neutral-700"
                  {...props}
                >
                  {children}
                </table>
              </div>
            );
          },
          thead({ children, ...props }) {
            return (
              <thead className="bg-primary-50 dark:bg-neutral-900" {...props}>
                {children}
              </thead>
            );
          },
          th({ children, ...props }) {
            return (
              <th
                className="px-2 py-1 font-semibold text-left border border-gray-300 dark:border-neutral-700"
                {...props}
              >
                {children}
              </th>
            );
          },
          td({ children, ...props }) {
            return (
              <td
                className="px-2 py-1 border border-gray-300 dark:border-neutral-700"
                {...props}
              >
                {children}
              </td>
            );
          },
          p({ children, ...props }) {
            return (
              <p
                className="my-1 text-sm leading-relaxed text-gray-800 dark:text-neutral-100"
                {...props}
              >
                {children}
              </p>
            );
          },
          hr({ ...props }) {
            return (
              <hr
                className="my-2 border-gray-300 dark:border-neutral-700"
                {...props}
              />
            );
          },
        }}
      >
        {normalizedText}
      </ReactMarkdown>
    </div>
  );
};

export default AiMessageContent;
