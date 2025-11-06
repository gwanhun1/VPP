import { Button } from '@vpp/shared-ui';
import { useEffect, useState } from 'react';
import { updateChatMessageBookmark, useAuthStore } from '@vpp/core-logic';

type AiChattingBoxButtonGroupProps = {
  messageText: string;
  sessionId?: string | null;
  messageId?: string;
  isBookmarked?: boolean;
};

const AiChattingBoxButtonGroup = ({
  messageText,
  sessionId,
  messageId,
  isBookmarked,
}: AiChattingBoxButtonGroupProps) => {
  const [star, setStar] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const authUser = useAuthStore((s) => s.authUser);

  // 전달된 북마크 상태로 초기값 동기화
  useEffect(() => {
    if (typeof isBookmarked === 'boolean') setStar(isBookmarked);
  }, [isBookmarked]);

  const handleStarClick = async () => {
    const next = !star;
    setStar(next);
    // 메시지 문서의 isBookmarked 토글 저장
    if (authUser && sessionId && messageId) {
      try {
        await updateChatMessageBookmark(
          authUser.uid,
          sessionId,
          messageId,
          next
        );
      } catch (e) {
        console.error('[AiChattingBox] 북마크 토글 실패:', e);
        setStar(!next);
      }
    }
  };

  const handleCopyClick = async () => {
    const resetTimer = () =>
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(messageText);
        setCopySuccess(true);
        resetTimer();
        return;
      }

      const textArea = document.createElement('textarea');
      textArea.value = messageText;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.select();

      const succeeded = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (!succeeded) {
        throw new Error('document.execCommand("copy") failed');
      }

      setCopySuccess(true);
      resetTimer();
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopySuccess(false);
    }
  };

  return (
    <div className="flex">
      <Button
        variant="ghost"
        isIconOnly
        rounded="full"
        size="xs"
        onClick={handleCopyClick}
        aria-label="메시지 복사"
      >
        {copySuccess ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 text-success"
          >
            <path
              fillRule="evenodd"
              d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.089a.75.75 0 0 0-1.172-.93l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
            />
          </svg>
        )}
      </Button>
      <Button
        variant="ghost"
        isIconOnly
        rounded="full"
        size="xs"
        onClick={handleStarClick}
      >
        {star ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 text-secondary"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        )}
      </Button>
    </div>
  );
};
export default AiChattingBoxButtonGroup;
