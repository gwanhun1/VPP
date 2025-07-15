import { Button, Text } from '@vpp/shared-ui';

type RecentQuestionBadgeProps = {
  question: string;
};

const RecentQuestionBadge = ({ question }: RecentQuestionBadgeProps) => {
  return (
    <Button variant="outline" rounded="full">
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
