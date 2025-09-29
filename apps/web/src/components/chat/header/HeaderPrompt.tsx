import { Button, Text } from '@vpp/shared-ui';
import { useChatInput } from '@/utils/inputProvider';

const ChattingHeaderPrompt = () => {
  const { messages, historyMode, startNewChat } = useChatInput();
  const inChat = historyMode || (messages?.length ?? 0) > 1;

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

  return (
    <div className="flex flex-col gap-1 justify-center items-center pt-3">
      {inChat ? (
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
          {/* 오른쪽 여백 (대칭을 위해) */}
          <div className="w-9 h-9"></div>
        </div>
      ) : (
        <>
          <Text variant="h5" weight="bold" color="white">
            오늘은 무엇을 배워볼까요?
          </Text>
          <Text variant="body2" className="text-primary-300">
            전력시장에 대해 궁금한 것을 자유롭게 물어보세요
          </Text>
        </>
      )}
    </div>
  );
};

export default ChattingHeaderPrompt;
