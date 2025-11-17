import { View } from 'react-native';

import tw from '../../utils/tailwind';
import useResponsive from '../../utils/useResponsive';
import type { MarketSnapshot, TrendsFilter } from '../hooks/useTrends';

import TrendContainer, { Trend } from './liveTrends/TrendContainer';
import TrendFilter from './liveTrends/TrendFilter';
import TrendsStatus from './status/TrendsStatus';

type TrendsProps = {
  loading: boolean;
  error: string | null;
  smp: MarketSnapshot;
  rec: MarketSnapshot;
  trends: Trend[];
  filter: TrendsFilter;
  onFilterChange: (filter: TrendsFilter) => void;
};

const Trends = ({
  loading,
  error,
  smp,
  rec,
  trends,
  filter,
  onFilterChange,
}: TrendsProps) => {
  const { containerMaxWidth, horizontalPadding } = useResponsive();

  return (
    <View
      style={{
        width: '100%',
        maxWidth: containerMaxWidth,
        paddingHorizontal: horizontalPadding,
      }}
    >
      <View style={tw`flex-col gap-4`}>
        <TrendsStatus loading={loading} error={error} smp={smp} rec={rec} />
        <TrendFilter filter={filter} onFilterChange={onFilterChange} />
        <TrendContainer trends={trends} loading={loading} />
      </View>
    </View>
  );
};

export default Trends;
