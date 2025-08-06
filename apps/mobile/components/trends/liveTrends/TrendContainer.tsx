import { ScrollView, View } from 'react-native';

import tw from '../../../utils/tailwind';
import Empty from '../../common/Empty';

import TrendCard from './TrendCard';

const TrendContainer = () => {
  return (
    <View style={tw`flex-1`}>
      <ScrollView style={tw`flex-1 max-h-96`} nestedScrollEnabled={true}>
        <View style={tw`flex-col gap-4`}>
          {MOCK_TRENDS && MOCK_TRENDS.length > 0 ? (
            MOCK_TRENDS.map((trend) => (
              <TrendCard key={trend.id} trend={trend} />
            ))
          ) : (
            <Empty />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default TrendContainer;

const MOCK_TRENDS = [
  {
    id: 1,
    title: 'DR 자원 입찰 마감',
    description: '수요자원 입찰 마감일입니다.',
    date: 'Wed Aug 04 2025 17:18:42 GMT+0900 (Korean Standard Time)',
    notification: '입찰 일정',
    level: 'orange',
    percentage: 10,
  },
  {
    id: 2,
    title: 'SMP(계통한계가격)',
    description: '전력의 도매시장 가격',
    date: 'Wed Aug 06 2025 17:18:42 GMT+0900 (Korean Standard Time)',
    notification: '시장 변동',
    level: 'red',
    percentage: -10,
  },
  {
    id: 3,
    title: 'DR 자원 입찰 마감',
    description: '수요자원 입찰 마감일입니다.',
    date: 'Wed Aug 04 2025 17:18:42 GMT+0900 (Korean Standard Time)',
    notification: '입찰 일정',
    level: 'orange',
    percentage: 10,
  },
];
