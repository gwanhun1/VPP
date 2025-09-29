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
  // user 역할의 메시지만 렌더링
  if (!message.isUser) return null;
  return (
    <div
      className="max-w-[80%] p-4 rounded-2xl bg-primary-500 text-white rounded-tr-sm shadow-lg
                  transition-all duration-500 ease-out
                  hover:shadow-xl hover:shadow-primary-600/30
                  hover:bg-primary
                  hover:transform hover:scale-[1.02]
                  cursor-pointer group"
    >
      <Text
        variant="body"
        color="white"
        className="pb-2 transition-colors duration-300 group-hover:text-white/95"
      >
        {message.text}
      </Text>
      <Text
        variant="caption"
        color="muted"
        className="transition-colors duration-300 group-hover:text-white/70"
      >
        {message.timestamp.toLocaleTimeString()}
      </Text>
    </div>
  );
};

export default UserChattingBox;
