import { RefreshControl, ScrollView, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { fetchRecMarketOdcloud, fetchSmpMarketOdcloud } from '@vpp/core-logic';

import tw from '../../utils/tailwind';
import useResponsive from '../../utils/useResponsive';

import TrendContainer from './liveTrends/TrendContainer';
import TrendFilter from './liveTrends/TrendFilter';
import TrendsStatus from './status/TrendsStatus';

type MarketSnapshot = { value: number | null; changeRate: number | null };

function toNumberOrNull(value?: string | number | null): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return Number.isNaN(value) ? null : value;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function calculateChangeRate(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

const Trends = () => {
  const { containerMaxWidth, horizontalPadding } = useResponsive();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [smp, setSmp] = useState<MarketSnapshot>({ value: null, changeRate: null });
  const [rec, setRec] = useState<MarketSnapshot>({ value: null, changeRate: null });

  const load = useCallback(async () => {
    setError(null);
    try {
      const [smpRows, recRows] = await Promise.all([
        fetchSmpMarketOdcloud({ perPage: 2 }),
        fetchRecMarketOdcloud({ perPage: 2 }),
      ]);

      const latestSmp = toNumberOrNull(smpRows.at(0)?.SMP ?? null);
      const prevSmp = toNumberOrNull(smpRows.at(1)?.SMP ?? null);
      const latestRec = toNumberOrNull(
        (recRows.at(0)?.['제주 평균가(원)'] as unknown as string | number | null) ?? null
      );
      const prevRec = toNumberOrNull(
        (recRows.at(1)?.['제주 평균가(원)'] as unknown as string | number | null) ?? null
      );

      setSmp({ value: latestSmp, changeRate: calculateChangeRate(latestSmp, prevSmp) });
      setRec({ value: latestRec, changeRate: calculateChangeRate(latestRec, prevRec) });
    } catch (e) {
      setError('시장 데이터를 불러오지 못했습니다');
      console.error('[Trends] 시장 데이터 로딩 실패:', e);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load().finally(() => setRefreshing(false));
  }, [load]);

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <View style={{ width: '100%', maxWidth: containerMaxWidth, paddingHorizontal: horizontalPadding }}>
        <View style={tw`flex-col gap-4`}>
          <TrendsStatus loading={loading} error={error} smp={smp} rec={rec} />
          <TrendFilter />
          <TrendContainer />
        </View>
      </View>
    </ScrollView>
  );
};

export default Trends;
