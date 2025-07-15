import { Badge, Text } from '@vpp/shared-ui';
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
    <div className="max-w-[80%] group">
      <div className="flex gap-2 items-center mb-1 w-full">
        <Badge variant="point" size="base" rounded="lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110"
          >
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634Zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 0 1-.189-.866c0-.298.059-.605.189-.866Zm2.023 6.828a.75.75 0 1 0-1.06-1.06 3.75 3.75 0 0 1-5.304 0 .75.75 0 0 0-1.06 1.06 5.25 5.25 0 0 0 7.424 0Z"
              clip-rule="evenodd"
            />
          </svg>
        </Badge>

        <Text variant="caption" color="primary" weight="bold">
          AI 전문가
        </Text>
      </div>

      <div
        className="p-4 text-gray-800 bg-white rounded-2xl rounded-tl-sm border shadow-sm border-primary-50 
                    transition-all duration-500 ease-out
                    hover:shadow-lg hover:shadow-primary-100/50 
                    hover:border-primary-100 
                    hover:transform hover:scale-[1.02] 
                    hover:bg-gradient-to-br hover:from-white hover:to-primary-25/30
                    cursor-pointer"
      >
        <Text
          variant="body"
          color="primary"
          className="pb-2 whitespace-pre-wrap transition-colors duration-300 group-hover:text-primary-600"
        >
          {message.text}
        </Text>

        <div className="flex gap-6 justify-between items-end">
          <Text
            variant="caption"
            color="muted"
            className="transition-colors duration-300 group-hover:text-primary-400"
          >
            {message.timestamp.toLocaleTimeString()}
          </Text>

          <div className="transition-transform duration-300 group-hover:translate-x-1">
            <AiChattingBoxButtonGroup messageText={message.text} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChattingBox;
