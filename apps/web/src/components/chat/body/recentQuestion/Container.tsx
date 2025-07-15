import { Text } from '@vpp/shared-ui';
import RecentQuestionBadge from './Badge';

const RecentQuestionContainer = () => {
  if (MOCK.length <= 1) return null;

  return (
    <div className="flex flex-col gap-2 px-6 py-4 border-b">
      <div className="flex gap-2 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5 text-neutral-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <Text variant="body2" color="muted">
          최근 질문
        </Text>
      </div>
      <div className="flex overflow-x-auto gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {MOCK.map((question) => (
          <RecentQuestionBadge key={question} question={question} />
        ))}
      </div>
    </div>
  );
};

export default RecentQuestionContainer;

const MOCK = [
  '전력시장에 대해 궁금한 것을 자유롭게 물어보세요',
  '전력시장에 대해 궁금한 것을 자유롭게 물어보세요',
  '전력시장에 대해 궁금한 것을 자유롭게 물어보세요',
];
