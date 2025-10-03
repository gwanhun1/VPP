import { Button, Text } from '@vpp/shared-ui';
import { useChatInput } from '@/utils/inputProvider';
import { useRef, useState } from 'react';
import HeaderMoreTooltip from './HeaderMoreTooltip';

const ChattingHeaderPrompt = () => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const moreAnchorRef = useRef<HTMLDivElement>(null);

  const { messages, startNewChat, currentSessionId } = useChatInput();

  // 채팅방 제목 생성 (첫 번째 사용자 메시지를 제목으로 사용)
  const getChatTitle = () => {
    const firstUserMessage = messages.find((msg) => msg.isUser);
    if (firstUserMessage) {
      return firstUserMessage.text.length > 20
        ? `${firstUserMessage.text.substring(0, 20)}...`
        : firstUserMessage.text;
    }
    return '새 채팅';
  };

  const handleMoreButtonClick = () => {
    setIsTooltipOpen((prev) => !prev);
  };
  const closeTooltip = () => {
    setIsTooltipOpen(false);
  };

  return (
    <div className="flex flex-col gap-1 justify-center items-center pt-3">
      <div className="flex justify-between items-center w-full">
        {/* 뒤로가기 버튼 */}
        <Button
          size="sm"
          isIconOnly
          rounded="full"
          onClick={() => {
            // 새 채팅 시작 (메시지, 세션, 히스토리 모드 모두 초기화)
            startNewChat();
          }}
          aria-label="뒤로가기"
          className="z-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="font-bold text-white size-3"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
        </Button>
        {/* 제목 */}
        <div className="flex-1 text-right max-w-60">
          <Text variant="h6" weight="bold" color="white" className="truncate">
            {getChatTitle()}
          </Text>
        </div>

        {/* 더보기 섹션 */}
        {currentSessionId ? (
          <div className="relative" ref={moreAnchorRef}>
            <Button
              size="sm"
              isIconOnly
              rounded="full"
              onClick={handleMoreButtonClick}
              aria-expanded={isTooltipOpen}
              aria-label="더보기 메뉴"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="relative z-10 w-6 h-6 text-white"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
            <HeaderMoreTooltip
              isOpen={isTooltipOpen}
              onClose={closeTooltip}
              anchorRef={moreAnchorRef}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChattingHeaderPrompt;
