import { Text } from '@vpp/shared-ui';
import AiChattingBoxButtonGroup from './AiChattingBoxButtonGroup';

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
      <div className="mb-2 w-full">
        <Text variant="caption" color="primary" weight="bold">
          AI 전문가
        </Text>
      </div>
      <div className="p-4 text-gray-800 bg-white rounded-2xl rounded-tl-sm border shadow-sm border-primary-50">
        <Text
          variant="body"
          color="primary"
          className="pb-2 whitespace-pre-wrap"
        >
          {message.text}
        </Text>
        <div className="flex gap-6 justify-between items-end">
          <Text variant="caption2" color="muted">
            {message.timestamp.toLocaleTimeString()}
          </Text>

          <AiChattingBoxButtonGroup />
        </div>
      </div>
    </div>
  );
};

export default AiChattingBox;
