import { Button, Text } from '@vpp/shared-ui';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useAuthStore } from '@vpp/core-logic';
import { useChatInput } from '@/utils/inputProvider';
import { updateChatSession, deleteChatSession } from '@vpp/core-logic';

type HeaderMoreTooltipProps = {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  onTitleUpdate?: (newTitle: string) => void;
};

type TooltipItem = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

const HeaderMoreTooltip = ({
  isOpen,
  onClose,
  anchorRef,
  onTitleUpdate,
}: HeaderMoreTooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const authUser = useAuthStore((s) => s.authUser);
  const { currentSessionId, startNewChat } = useChatInput();

  // anchor 위치에 따라 툴팁 위치 계산
  const computePosition = useCallback(() => {
    const anchor = anchorRef.current as HTMLElement | null;
    const panel = tooltipRef.current;
    if (!anchor || !panel) return;

    const rect = anchor.getBoundingClientRect();
    const panelWidth = panel.offsetWidth;
    const gap = 8; // 버튼 아래 여백
    const top = rect.bottom + gap;
    const left = Math.max(8, rect.right - panelWidth); // 우측 정렬, 화면 밖 방지
    setPos({ top, left });
  }, [anchorRef]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    // 초기 렌더 후 측정
    const id = requestAnimationFrame(computePosition);
    return () => cancelAnimationFrame(id);
  }, [isOpen, computePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = () => computePosition();
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [isOpen, computePosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  const handleRename = async () => {
    if (!authUser || !currentSessionId) {
      alert('세션 정보를 찾을 수 없습니다.');
      return;
    }

    const next = window.prompt('새 대화명을 입력하세요');
    if (!next || !next.trim()) {
      return;
    }

    try {
      const newTitle =
        next.trim().length > 30
          ? `${next.trim().substring(0, 30)}...`
          : next.trim();

      await updateChatSession(authUser.uid, currentSessionId, {
        title: newTitle,
      });

      // 부모 컴포넌트에 제목 업데이트 알림
      if (onTitleUpdate) {
        onTitleUpdate(newTitle);
      }

      onClose();
      alert('대화명이 수정되었습니다.');
    } catch (e) {
      console.error('[HeaderMoreTooltip] 대화명 수정 실패:', e);
      alert('대화명 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDelete = async () => {
    if (!authUser || !currentSessionId) {
      alert('세션 정보를 찾을 수 없습니다.');
      return;
    }

    const ok = window.confirm(
      '이 대화를 삭제하시겠습니까?\n삭제된 대화는 복구할 수 없습니다.'
    );
    if (!ok) return;

    try {
      // 삭제 진행 중 표시
      await deleteChatSession(authUser.uid, currentSessionId);

      // 삭제 후 새 채팅 상태로 초기화
      startNewChat();
      onClose();

      alert('대화가 삭제되었습니다.');
    } catch (e) {
      console.error('[HeaderMoreTooltip] 대화 삭제 실패:', e);
      alert('대화 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const tooltipItems: TooltipItem[] = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
        </svg>
      ),
      label: '대화명 수정',
      onClick: handleRename,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
            clipRule="evenodd"
          />
        </svg>
      ),
      label: '대화 삭제',
      onClick: handleDelete,
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-[900]" aria-hidden="true" />}
      <div
        ref={tooltipRef}
        className="overflow-hidden fixed py-2 w-56 bg-white rounded-xl shadow-lg z-[1000]"
        style={{ top: pos.top, left: pos.left }}
      >
        {/* Firebase 연결 상태 표시 */}
        {authUser && (
          <div className="px-4 py-2 border-b border-gray-100">
            <Text className="text-sm font-medium text-green-600 truncate">
              {authUser.email || authUser.displayName || 'Unknown User'}
            </Text>
          </div>
        )}

        <div className="flex flex-col gap-1 px-2 py-1">
          {tooltipItems.map((item, index) => (
            <Button
              variant="ghost"
              key={index}
              className="flex items-center px-4 py-2 w-full transition-colors hover:bg-gray-50"
              onClick={item.onClick}
            >
              <span className="mr-3 text-gray-500">{item.icon}</span>
              <Text variant="body2" className="text-gray-700">
                {item.label}
              </Text>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};

export default HeaderMoreTooltip;
