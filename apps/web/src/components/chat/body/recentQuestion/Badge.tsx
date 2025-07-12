import { Button, Text } from '@vpp/shared-ui/components';

type RecentQuestionBadgeProps = {
  question: string;
};

const RecentQuestionBadge = ({ question }: RecentQuestionBadgeProps) => {
  return (
    <Button variant="outline" rounded="full">
      <Text
        variant="caption"
        className="whitespace-nowrap text-primary-700"
        weight="medium"
      >
        {question}
      </Text>
    </Button>
  );
};

export default RecentQuestionBadge;
