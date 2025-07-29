import { Button, Text } from '@vpp/shared-ui';
import ChattingHeaderPrompt from './HeaderPrompt';
import HeaderMoreTooltip from './HeaderMoreTooltip';
import { useState } from 'react';

const ChattingHeader = () => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleMoreButtonClick = () => {
    setIsTooltipOpen((prev) => !prev);
  };

  const closeTooltip = () => {
    setIsTooltipOpen(false);
  };
  return (
    <header className="flex overflow-hidden relative flex-col justify-end px-6 pb-2 h-40 sm:h-48 bg-primary">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full translate-x-1/2 -translate-y-1/2 bg-white/5"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full -translate-x-1/2 translate-y-1/2 bg-secondary/10"></div>

      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          {/* AI 아이콘 */}
          <div className="flex justify-center items-center p-3 rounded-xl backdrop-blur-sm bg-white/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-white"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* 텍스트 섹션 */}
          <div className="flex flex-col justify-center">
            <Text variant="h5" weight="bold" color="white">
              전력시장 AI
            </Text>
            <Text variant="caption" className="text-secondary-dark">
              전문가 어시스턴트
            </Text>
          </div>
        </div>

        {/* 더보기 섹션 */}
        <div className="relative">
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
          <HeaderMoreTooltip isOpen={isTooltipOpen} onClose={closeTooltip} />
        </div>
      </div>

      <ChattingHeaderPrompt />
    </header>
  );
};

export default ChattingHeader;
