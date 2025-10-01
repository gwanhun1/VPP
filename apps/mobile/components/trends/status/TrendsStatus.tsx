import { fetchJejuRecDaily, fetchJejuSmpDaily } from '@vpp/core-logic';
import { Card, Text } from '@vpp/shared-ui';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import tw from '../../../utils/tailwind';

const TrendsStatus = () => {
  const greenColor = tw.color('green-500');
  const secondaryColor = tw.color('secondary-400');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [smp, setSmp] = useState<MarketSnapshot>({ value: null, changeRate: null });
  const [rec, setRec] = useState<MarketSnapshot>({ value: null, changeRate: null });

  const targetDate = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');
    const day = `${today.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadMarketData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [smpItems, recItems] = await Promise.all([
          fetchJejuSmpDaily(targetDate),
          fetchJejuRecDaily(targetDate),
        ]);

        if (!mounted) return;

        const latestSmp = smpItems.at(0);
        const latestRec = recItems.at(0);

        setSmp({
          value: toNumberOrNull(latestSmp?.smp),
          changeRate: toNumberOrNull(latestSmp?.chgRt),
        });
        setRec({
          value: toNumberOrNull(latestRec?.avgPrc),
          changeRate: toNumberOrNull(latestRec?.chgRt),
        });
      } catch (err) {
        if (mounted) {
          setError('시장 데이터를 불러오지 못했습니다');
          console.error('[TrendsStatus] 시장 데이터 로딩 실패:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadMarketData();

    return () => {
      mounted = false;
    };
  }, [targetDate]);

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
                <ActivityIndicator size="small" color="#ffffff" />
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

type MarketSnapshot = {
  value: number | null;
  changeRate: number | null;
};

function toNumberOrNull(value?: string | null): number | null {
  if (value === undefined || value === null) {
    return null;
  }
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
}

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
