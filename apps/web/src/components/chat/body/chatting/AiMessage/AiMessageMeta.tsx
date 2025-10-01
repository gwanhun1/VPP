import { Text } from '@vpp/shared-ui';
import AiChattingBoxButtonGroup from '../AiChattingBoxButtonGroup';

type AiMessageMetaProps = {
  timestamp: Date;
  messageText: string;
  sessionId?: string | null;
  messageId?: string;
  isBookmarked?: boolean;
};

const AiMessageMeta = ({
  timestamp,
  messageText,
  sessionId,
  messageId,
  isBookmarked,
}: AiMessageMetaProps) => {
  return (
    <div className="flex gap-6 justify-between items-end">
      <Text
        variant="caption"
        color="muted"
        className="transition-colors duration-300 group-hover:text-primary-400"
      >
        {timestamp.toLocaleTimeString()}
      </Text>

      <div className="transition-transform duration-300 group-hover:translate-x-1">
        <AiChattingBoxButtonGroup
          messageText={messageText}
          sessionId={sessionId}
          messageId={messageId}
          isBookmarked={isBookmarked}
        />
      </div>
    </div>
  );
};

export default AiMessageMeta;
