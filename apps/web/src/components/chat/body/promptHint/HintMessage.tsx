import { Button } from '@vpp/shared-ui';
import { useChatInput } from '@/utils/inputProvider';

type PromptHintMessageProps = {
  message: string;
};

const PromptHintMessage = ({ message }: PromptHintMessageProps) => {
  const { setInputText } = useChatInput();

  const handleClick = () => {
    setInputText(message);
  };

  return (
    <Button variant="outline" rounded="2xl" onClick={handleClick}>
      {message}
    </Button>
  );
};

export default PromptHintMessage;
