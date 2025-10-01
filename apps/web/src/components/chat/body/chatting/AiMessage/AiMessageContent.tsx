import { Text } from '@vpp/shared-ui';

type AiMessageContentProps = {
  text: string;
};

const AiMessageContent = ({ text }: AiMessageContentProps) => {
  return (
    <Text
      variant="body"
      color="primary"
      className="pb-2 whitespace-pre-wrap transition-colors duration-300 group-hover:text-primary-600"
    >
      {text}
    </Text>
  );
};

export default AiMessageContent;
