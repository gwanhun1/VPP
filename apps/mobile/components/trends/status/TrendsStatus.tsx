import { Card, Text, Skeleton } from '@vpp/shared-ui';
import { View } from 'react-native';

import tw from '../../../utils/tailwind';

type MarketSnapshot = {
  value: number | null;
  changeRate: number | null;
};

type TrendsStatusProps = {
  loading: boolean;
  error: string | null;
  smp: MarketSnapshot;
  rec: MarketSnapshot;
};

const TrendsStatus = ({ loading, error, smp, rec }: TrendsStatusProps) => {
  const greenColor = tw.color('green-500');
  const secondaryColor = tw.color('secondary-400');

  const cards: Array<{
    title: string;
    snapshot: MarketSnapshot;
    backgroundColor: string | undefined;
  }> = [
    {
      title: 'SMP (원/kWh)',
      snapshot: smp,
      backgroundColor: greenColor,
    },
    {
      title: 'REC (원/kWh)',
      snapshot: rec,
      backgroundColor: secondaryColor,
    },
  ];

  return (
    <View style={tw`flex-row items-center gap-2`}>
      {cards.map((card) => (
        <View key={card.title} style={tw`flex-1`}>
          <Card bordered backgroundColor={card.backgroundColor}>
            <View style={tw`flex-col justify-center items-center gap-2 py-2`}>
              {loading ? (
                <>
                  <Skeleton width={80} height={32} rounded />
                  <Skeleton width={96} height={16} rounded />
                  <Skeleton width={64} height={12} rounded />
                </>
              ) : error ? (
                <Text variant="body2" color="white">
                  {error}
                </Text>
              ) : (
                <>
                  <Text variant="h4" weight="bold" color="white">
                    {formatValue(card.snapshot.value)}
                  </Text>
                  <Text variant="body2" color="white">
                    {card.title}
                  </Text>
                  <Text variant="subtitle2" weight="semibold" color="white">
                    {formatChangeRate(card.snapshot.changeRate)}
                  </Text>
                </>
              )}
            </View>
          </Card>
        </View>
      ))}
    </View>
  );
};

function formatValue(value: number | null): string {
  if (value === null) {
    return '-';
  }
  return value.toFixed(2);
}

function formatChangeRate(rate: number | null): string {
  if (rate === null) {
    return '-';
  }
  if (rate > 0) {
    return `↑ ${Math.abs(rate).toFixed(2)}%`;
  }
  if (rate < 0) {
    return `↓ ${Math.abs(rate).toFixed(2)}%`;
  }
  return '→ 0.00%';
}

export default TrendsStatus;
