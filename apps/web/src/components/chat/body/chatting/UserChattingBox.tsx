import { Text } from '@vpp/shared-ui';

type UserChattingBoxProps = {
  message: {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
  };
};

const UserChattingBox = ({ message }: UserChattingBoxProps) => {
  return (
    <div className="max-w-[80%] p-4 rounded-2xl bg-primary-500 text-white rounded-tr-sm shadow-lg">
      <Text variant="body" color="white" className="pb-2">
        {message.text}
      </Text>
      <Text variant="caption2" color="muted">
        {message.timestamp.toLocaleTimeString()}
      </Text>
    </div>
  );
};

export default UserChattingBox;
