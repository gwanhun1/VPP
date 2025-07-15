import { Button, Text } from '@vpp/shared-ui';
import { useEffect, useRef } from 'react';

type HeaderMoreTooltipProps = {
  isOpen: boolean;
  onClose: () => void;
};

type TooltipItem = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

const HeaderMoreTooltip = ({ isOpen, onClose }: HeaderMoreTooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

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
      onClick: () => {
        console.log('대화명 수정 클릭');
      },
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
      label: '대화 초기화',
      onClick: () => {
        console.log('대화 초기화 클릭');
      },
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-90" aria-hidden="true" />}
      <div
        ref={tooltipRef}
        className="absolute z-100 right-0 top-full mt-2 bg-white rounded-xl shadow-lg py-2 w-56 overflow-hidden"
      >
        {tooltipItems.map((item, index) => (
          <Button
            variant="ghost"
            key={index}
            className="flex items-center w-full px-4 py-2 hover:bg-gray-50 transition-colors"
            onClick={item.onClick}
          >
            <span className="text-gray-500 mr-3">{item.icon}</span>
            <Text variant="body2" className="text-gray-700">
              {item.label}
            </Text>
          </Button>
        ))}
      </div>
    </>
  );
};

export default HeaderMoreTooltip;
