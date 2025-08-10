import { Text } from '@vpp/shared-ui';

const ChattingHeaderPrompt = () => {
  return (
    <div className="flex flex-col gap-1 justify-center items-center px-4 pt-3">
      <Text variant="h5" weight="bold" color="white">
        오늘은 무엇을 배워볼까요?
      </Text>
      <Text variant="body2" className="text-primary-300">
        전력시장에 대해 궁금한 것을 자유롭게 물어보세요
      </Text>
    </div>
  );
};

export default ChattingHeaderPrompt;
