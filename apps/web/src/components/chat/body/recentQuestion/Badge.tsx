import { Button, Text } from '@vpp/shared-ui';

type RecentQuestionBadgeProps = {
  question: string;
  onClick?: () => void;
};

const RecentQuestionBadge = ({ question, onClick }: RecentQuestionBadgeProps) => {
  return (
    <Button variant="outline" rounded="full" onClick={onClick}>
      <Text
        variant="body2"
        className="whitespace-nowrap text-primary-700"
        weight="medium"
      >
        {question}
      </Text>
    </Button>
  );
};

export default RecentQuestionBadge;
