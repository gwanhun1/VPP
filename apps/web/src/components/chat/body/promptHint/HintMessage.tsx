import { Button } from '@vpp/shared-ui';
import { useChatInput } from '@/utils/inputProvider';

type PromptHintMessageProps = {
  message: string;
};

const PromptHintMessage = ({ message }: PromptHintMessageProps) => {
  const { setInputText } = useChatInput();

  const handleClick = () => {
    console.log('[HintMessage] 클릭 이벤트 발생:', message);
    setInputText(message);
    console.log('[HintMessage] setInputText 호출 완료');
  };

  return (
    <Button 
      variant="outline" 
      rounded="2xl" 
      onClick={handleClick}
    >
      {message}
    </Button>
  );
};

export default PromptHintMessage;
