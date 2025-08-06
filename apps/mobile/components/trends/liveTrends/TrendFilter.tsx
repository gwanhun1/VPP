import { Text } from '@vpp/shared-ui';
import { useState } from 'react';
import { View } from 'react-native';

import tw from '../../../utils/tailwind';

import FilterButtons from './FilterButtons';

const TrendFilter = () => {
  const [filter, setFilter] = useState(1);
  return (
    <View style={tw`flex-col gap-2`}>
      <Text variant="h5" weight="bold" color="primary">
        필터
      </Text>
      <View style={tw`flex-row items-center gap-2`}>
        {MOCK_DATA.map((item) => (
          <FilterButtons
            key={item.id}
            id={item.id}
            title={item.title}
            filter={filter}
            onPress={() => setFilter(item.id)}
          />
        ))}
      </View>
    </View>
  );
};

export default TrendFilter;

const MOCK_DATA = [
  {
    id: 1,
    title: '전체',
  },
  {
    id: 2,
    title: 'SMP',
  },
  {
    id: 3,
    title: 'REC',
  },
];
