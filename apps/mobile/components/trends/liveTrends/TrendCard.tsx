import AntDesign from '@expo/vector-icons/AntDesign';
import { Badge, Card, CardBody, CardHeader, Text } from '@vpp/shared-ui';
import { format } from 'date-fns';
import { View } from 'react-native';

import tw from '../../../utils/tailwind';

type TrendCardProps = {
  trend: {
    id: number;
    title: string;
    description: string;
    date: Date;
    notification: string;
    percentage: number;
    level: string;
  };
};

const TrendCard = ({ trend }: TrendCardProps) => {
  const primaryColor = tw.color('primary');

  return (
    <Card bordered>
      <View style={tw`flex-col gap-2`}>
        <CardHeader>
          <View style={tw`flex-row items-center gap-2`}>
            <View
              style={tw`flex-row gap-2 items-center h-4 w-4 bg-[${trend.level}] rounded-full`}
            />
            <Badge variant="info" size="xs" rounded="full">
              <Text variant="body2" weight="bold" color="info">
                {trend.notification}
              </Text>
            </Badge>
            <Badge
              variant={trend.percentage > 0 ? 'success' : 'error'}
              size="xs"
              rounded="full"
            >
              <Text
                variant="body2"
                weight="bold"
                color={trend.percentage > 0 ? 'success' : 'error'}
              >
                {trend.percentage > 0 ? '+' : ''}
                {trend.percentage}%
              </Text>
            </Badge>
          </View>
        </CardHeader>

        <CardBody>
          <Text variant="h5" weight="bold" color="primary">
            {trend.title}
          </Text>
          <View style={tw`min-h-16 py-2`}>
            <Text variant="body" color="primary">
              {trend.description}
            </Text>
          </View>
        </CardBody>

        <Card variant="primary">
          <View style={tw`flex-row items-center gap-4`}>
            <View style={tw`flex-row items-center gap-2`}>
              <AntDesign name="calendar" size={14} color={primaryColor} />
              <Text variant="body2" color="primary">
                {format(trend.date, 'yyyy-MM-dd')}
              </Text>
            </View>
            <View style={tw`flex-row items-center gap-2`}>
              <AntDesign name="clock-circle" size={14} color={primaryColor} />
              <Text variant="body2" color="primary">
                {format(trend.date, 'HH:mm')}
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </Card>
  );
};

export default TrendCard;
