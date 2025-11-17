import { Text } from '@vpp/shared-ui';
import { View } from 'react-native';

import tw from '../../../utils/tailwind';
import type { TrendsFilter } from '../../hooks/useTrends';

import FilterButtons from './FilterButtons';

type TrendFilterProps = {
  filter: TrendsFilter;
  onFilterChange: (filter: TrendsFilter) => void;
};

const FILTER_OPTIONS: Array<{ id: TrendsFilter; title: string }> = [
  {
    id: 'ALL',
    title: '전체',
  },
  {
    id: 'SMP',
    title: 'SMP',
  },
  {
    id: 'REC',
    title: 'REC',
  },
];

const TrendFilter = ({ filter, onFilterChange }: TrendFilterProps) => {
  return (
    <View style={tw`flex-col gap-2`}>
      <Text variant="h5" weight="bold" color="primary">
        필터
      </Text>
      <View style={tw`flex-row items-center gap-2`}>
        {FILTER_OPTIONS.map((item) => (
          <FilterButtons
            key={item.id}
            id={item.id}
            title={item.title}
            filter={filter}
            onPress={() => onFilterChange(item.id)}
          />
        ))}
      </View>
    </View>
  );
};

export default TrendFilter;
