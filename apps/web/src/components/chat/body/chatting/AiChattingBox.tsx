import { Text } from '@vpp/shared-ui';

type AiChattingBoxProps = {
  message: {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
  };
};

const AiChattingBox = ({ message }: AiChattingBoxProps) => {
  return (
    <div className="max-w-[80%]">
      <div className="w-full">
        <Text variant="caption" color="primary" weight="bold">
          AI 전문가
        </Text>
      </div>
      <div className="p-4 text-gray-800 bg-white rounded-2xl rounded-tl-sm border shadow-sm border-primary-50">
        <Text variant="body" color="primary" className="pb-2">
          {message.text}
        </Text>
        <Text variant="caption2" color="muted">
          {message.timestamp.toLocaleTimeString()}
        </Text>
      </div>
    </div>
  );
};

export default AiChattingBox;
