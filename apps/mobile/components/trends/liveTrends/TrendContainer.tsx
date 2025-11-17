import { ScrollView, View } from 'react-native';

import tw from '../../../utils/tailwind';
import Empty from '../../common/Empty';
import { Skeleton } from '@vpp/shared-ui';

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

const TrendContainer = ({
  trends,
  loading,
}: TrendContainerProps & { loading?: boolean }) => {
  return (
    <View style={tw`flex-1`}>
      <ScrollView style={tw`flex-1 max-h-96`} nestedScrollEnabled={true}>
        <View style={tw`flex-col gap-4`}>
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <View key={index} style={tw`flex-row items-center gap-3`}>
                <Skeleton width={52} height={52} rounded />
                <View style={tw`flex-1 gap-1`}>
                  <Skeleton width="70%" height={18} rounded />
                  <Skeleton width="50%" height={14} rounded />
                  <Skeleton width="40%" height={12} rounded />
                </View>
              </View>
            ))
          ) : trends && trends.length > 0 ? (
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
