import { Text } from '@vpp/shared-ui';

const ChattingHeaderPrompt = () => {
  return (
    <div className="flex flex-col gap-2 justify-center items-center px-4 pt-6">
      <Text variant="h4" weight="bold" color="white">
        오늘은 무엇을 배워볼까요?
      </Text>
      <Text variant="caption" className="text-primary-400">
        전력시장에 대해 궁금한 것을 자유롭게 물어보세요
      </Text>
    </div>
  );
};

export default ChattingHeaderPrompt;
