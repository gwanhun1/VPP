import { Button } from '@vpp/shared-ui';

type PromptHintMessageProps = {
  message: string;
};

const PromptHintMessage = ({ message }: PromptHintMessageProps) => {
  return (
    <Button variant="outline" rounded="2xl">
      {message}
    </Button>
  );
};

export default PromptHintMessage;
