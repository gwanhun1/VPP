import { Badge, Skeleton, Text } from '@vpp/shared-ui';
import AiChattingBoxButtonGroup from './AiChattingBoxButtonGroup';
import { useEffect, useState } from 'react';

type AiChattingBoxProps = {
  message: {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
  };
  layout?: boolean;
};

const AiChattingBox = ({ message, layout }: AiChattingBoxProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // 메시지가 표시될 때 로딩 효과를 위한 타이머 설정
  useEffect(() => {
    // 메시지가 렌더링된 후 일정 시간이 지나면 로딩 상태를 false로 변경
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 적절한 시간으로 조정 (fade-in 애니메이션과 겹치지 않도록)

    return () => clearTimeout(loadingTimer);
  }, []);

  // assistant 역할의 메시지만 렌더링
  if (message.isUser) return null;

  return (
    <div className="max-w-[80%] group">
      <div className="flex gap-2 items-center mb-1 w-full">
        <Badge variant="point" size="base" rounded="lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634Zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 0 1-.189-.866c0-.298.059-.605.189-.866Zm2.023 6.828a.75.75 0 1 0-1.06-1.06 3.75 3.75 0 0 1-5.304 0 .75.75 0 0 0-1.06 1.06 5.25 5.25 0 0 0 7.424 0Z"
              clipRule="evenodd"
            />
          </svg>
        </Badge>

        <Text variant="caption" color="primary" weight="bold">
          AI 전문가
        </Text>
      </div>

      <Skeleton
        isOverlay={true}
        rounded={true}
        isLoading={layout ? false : isLoading}
        className="rounded-2xl rounded-tl-sm transition-opacity duration-300"
      >
        <div
          className="p-4 text-gray-800 bg-white rounded-2xl rounded-tl-sm border shadow-sm border-primary-50 
                      transition-opacity duration-500 
                      hover:shadow-lg hover:shadow-primary-100/50 
                      hover:border-primary-100 
                      hover:transform hover:scale-[1.02] 
                      hover:bg-gradient-to-br hover:from-white hover:to-primary-25/30
                      cursor-pointer
                      opacity-100"
        >
          <Text
            variant="body"
            color="primary"
            className="pb-2 whitespace-pre-wrap transition-colors duration-300 group-hover:text-primary-600"
          >
            {message.text}
          </Text>

          <div className="flex gap-6 justify-between items-end">
            <Text
              variant="caption"
              color="muted"
              className="transition-colors duration-300 group-hover:text-primary-400"
            >
              {message.timestamp.toLocaleTimeString()}
            </Text>

            <div className="transition-transform duration-300 group-hover:translate-x-1">
              <AiChattingBoxButtonGroup messageText={message.text} />
            </div>
          </div>
        </div>
      </Skeleton>
    </div>
  );
};

export default AiChattingBox;
