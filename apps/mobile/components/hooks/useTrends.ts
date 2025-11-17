import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  fetchRecMarketOdcloud,
  fetchSmpMarketOdcloud,
  toNumber,
} from '@vpp/core-logic';

import type { Trend } from '../trends/liveTrends/TrendContainer';

export type MarketSnapshot = {
  value: number | null;
  changeRate: number | null;
};

export type TrendsFilter = 'ALL' | 'SMP' | 'REC';

function calculateChangeRate(
  current: number | null,
  previous: number | null
): number | null {
  if (current === null || previous === null || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export const useTrends = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [smp, setSmp] = useState<MarketSnapshot>({
    value: null,
    changeRate: null,
  });
  const [rec, setRec] = useState<MarketSnapshot>({
    value: null,
    changeRate: null,
  });
  const [trends, setTrends] = useState<Trend[]>([]);
  const [filter, setFilter] = useState<TrendsFilter>('ALL');

  const load = useCallback(async () => {
    setError(null);
    try {
      const [smpRows, recRows] = await Promise.all([
        fetchSmpMarketOdcloud({ perPage: 2 }),
        fetchRecMarketOdcloud({ perPage: 2 }),
      ]);

      const latestSmp = toNumber(smpRows[0]?.SMP ?? null);
      const prevSmp = toNumber(smpRows[1]?.SMP ?? null);

      const latestRecValue = recRows[0]?.['제주 평균가(원)'];
      const latestRec = toNumber(
        typeof latestRecValue === 'string' || typeof latestRecValue === 'number'
          ? latestRecValue
          : null
      );

      const prevRecValue = recRows[1]?.['제주 평균가(원)'];
      const prevRec = toNumber(
        typeof prevRecValue === 'string' || typeof prevRecValue === 'number'
          ? prevRecValue
          : null
      );

      const latestSmpDateStr = smpRows[0]?.거래일자;
      const latestSmpDate = latestSmpDateStr
        ? new Date(latestSmpDateStr)
        : new Date();

      const latestRecDateStr = recRows[0]?.거래일;
      const latestRecDate = latestRecDateStr
        ? new Date(latestRecDateStr)
        : new Date();

      const smpChangeRate = calculateChangeRate(latestSmp, prevSmp);
      const recChangeRate = calculateChangeRate(latestRec, prevRec);

      setSmp({
        value: latestSmp,
        changeRate: smpChangeRate,
      });
      setRec({
        value: latestRec,
        changeRate: recChangeRate,
      });

      const nextTrends: Trend[] = [];

      if (latestSmp !== null && smpChangeRate !== null) {
        nextTrends.push({
          id: 1,
          title: 'SMP(계통한계가격)',
          description:
            smpChangeRate > 0
              ? '전일 대비 SMP가 상승했습니다.'
              : smpChangeRate < 0
              ? '전일 대비 SMP가 하락했습니다.'
              : '전일 대비 SMP 변동이 없습니다.',
          date: latestSmpDate,
          notification: '시장 변동',
          percentage: Number(smpChangeRate.toFixed(2)),
          level:
            smpChangeRate > 0 ? 'green' : smpChangeRate < 0 ? 'red' : 'gray',
        });
      }

      if (latestRec !== null && recChangeRate !== null) {
        nextTrends.push({
          id: 2,
          title: 'REC 현물시장(제주 평균가)',
          description:
            recChangeRate > 0
              ? '전일 대비 REC 평균가가 상승했습니다.'
              : recChangeRate < 0
              ? '전일 대비 REC 평균가가 하락했습니다.'
              : '전일 대비 REC 평균가 변동이 없습니다.',
          date: latestRecDate,
          notification: '시장 변동',
          percentage: Number(recChangeRate.toFixed(2)),
          level:
            recChangeRate > 0 ? 'green' : recChangeRate < 0 ? 'red' : 'gray',
        });
      }

      setTrends(nextTrends);
    } catch (e) {
      setError('시장 데이터를 불러오지 못했습니다');
      console.error('[useTrends] 시장 데이터 로딩 실패:', e);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  const filteredTrends = useMemo(() => {
    if (filter === 'ALL') return trends;
    if (filter === 'SMP') return trends.filter((t) => t.id === 1);
    if (filter === 'REC') return trends.filter((t) => t.id === 2);
    return trends;
  }, [trends, filter]);

  return {
    loading,
    error,
    refreshing,
    smp,
    rec,
    trends: filteredTrends,
    filter,
    setFilter,
    refresh,
  };
};
