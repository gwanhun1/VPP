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
  const { currentSessionId } = useChatInput();

  // 빈 텍스트 메시지만 스켈레톤 표시 (응답 생성 중)
  const isLoadingSkeleton = message.text === '';

  // assistant 역할의 메시지만 렌더링
  if (message.isUser) return null;

  // 링크 클릭 방지 (상위 레벨 방어)
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.closest('a')) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="max-w-[80%] group" onClick={handleClick}>
      <AiMessageHeader />
      <AiMessageSkeleton isLoading={isLoadingSkeleton}>
        <div
          className="p-4 text-gray-800 dark:text-neutral-100 bg-white dark:bg-[#0a1120] rounded-2xl rounded-tl-sm border shadow-sm border-primary-50 dark:border-neutral-800 
                      transition-opacity duration-500 
                      hover:shadow-lg hover:shadow-primary-100/50 dark:hover:shadow-primary-900/40 
                      hover:border-primary-100 dark:hover:border-primary-700 
                      hover:transform hover:scale-[1.02] 
                      hover:bg-gradient-to-br hover:from-white hover:to-primary-25/30 dark:hover:from-[#020617] dark:hover:to-primary-950/40
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
