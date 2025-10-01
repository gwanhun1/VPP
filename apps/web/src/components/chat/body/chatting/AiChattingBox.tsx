import { useEffect, useState } from 'react';
import { useChatInput } from '@/utils/inputProvider';
import AiMessageHeader from './AiMessage/AiMessageHeader';
import AiMessageSkeleton from './AiMessage/AiMessageSkeleton';
import AiMessageContent from './AiMessage/AiMessageContent';
import AiMessageMeta from './AiMessage/AiMessageMeta';

type AiChattingBoxProps = {
  message: {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
    messageId?: string;
    isBookmarked?: boolean;
  };
  layout?: boolean;
};

const AiChattingBox = ({ message, layout }: AiChattingBoxProps) => {
  const [isLoading, setIsLoading] = useState(!layout);
  const { currentSessionId } = useChatInput();

  // 메시지가 표시될 때 로딩 효과를 위한 타이머 설정
  useEffect(() => {
    if (layout) {
      setIsLoading(false);
      return;
    }

    const loadingTimer = window.setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => window.clearTimeout(loadingTimer);
  }, [layout]);

  // assistant 역할의 메시지만 렌더링
  if (message.isUser) return null;

  return (
    <div className="max-w-[80%] group">
      <AiMessageHeader />

      <AiMessageSkeleton isLoading={isLoading}>
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
          <AiMessageContent text={message.text} />

          <AiMessageMeta
            timestamp={message.timestamp}
            messageText={message.text}
            sessionId={currentSessionId}
            messageId={message.messageId}
            isBookmarked={message.isBookmarked}
          />
        </div>
      </AiMessageSkeleton>
    </div>
  );
};

export default AiChattingBox;
