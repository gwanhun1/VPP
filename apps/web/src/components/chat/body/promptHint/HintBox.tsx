import { Text } from '@vpp/shared-ui';
import PromptHintMessage from './HintMessage';
import ScrollIndicator from './ScrollAnimation';

const PromptHintBox = () => {
  return (
    <div className="flex flex-col flex-1 gap-2 justify-end items-center px-2 mt-2">
      <div className="flex gap-2 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 text-secondary-500"
        >
          <path d="M10.618 10.26c-.361.223-.618.598-.618 1.022 0 .226-.142.43-.36.49A6.006 6.006 0 0 1 8 12c-.569 0-1.12-.08-1.64-.227a.504.504 0 0 1-.36-.491c0-.424-.257-.799-.618-1.021a5 5 0 1 1 5.235 0ZM6.867 13.415a.75.75 0 1 0-.225 1.483 9.065 9.065 0 0 0 2.716 0 .75.75 0 1 0-.225-1.483 7.563 7.563 0 0 1-2.266 0Z" />
        </svg>

        <Text variant="body2" color="muted">
          이런 질문들을 해보세요
        </Text>
      </div>
      <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-[140px] px-2 relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {MOCK.slice(0, 4).map((item) => (
          <PromptHintMessage key={item.id} message={item.message} />
        ))}
        {MOCK.length > 4 && (
          <div className="flex flex-col gap-2">
            {MOCK.slice(4).map((item) => (
              <PromptHintMessage key={item.id} message={item.message} />
            ))}
            <ScrollIndicator visible={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptHintBox;

const MOCK = [
  { id: 0, message: '계통한계가격이 무엇인가요?' },
  { id: 1, message: '수요반응 사업은 어떻게 참여하나요?' },
  { id: 2, message: '계약기간이 얼마인가요?' },
  { id: 3, message: '신재생 에너지가 뭔가요?' },
  { id: 4, message: '전력거래소의 역할은 뭔가요?' },
];
