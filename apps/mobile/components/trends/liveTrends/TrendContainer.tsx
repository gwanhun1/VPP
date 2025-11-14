import { ScrollView, View } from 'react-native';

import tw from '../../../utils/tailwind';
import Empty from '../../common/Empty';

import TrendCard from './TrendCard';

export type Trend = {
  id: number;
  title: string;
  description: string;
  date: Date;
  notification: string;
  percentage: number;
  level: string;
};

type TrendContainerProps = {
  trends: Trend[];
};

const TrendContainer = ({ trends }: TrendContainerProps) => {
  return (
    <View style={tw`flex-1`}>
      <ScrollView style={tw`flex-1 max-h-96`} nestedScrollEnabled={true}>
        <View style={tw`flex-col gap-4`}>
          {trends && trends.length > 0 ? (
            trends.map((trend) => <TrendCard key={trend.id} trend={trend} />)
          ) : (
            <Empty />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default TrendContainer;
