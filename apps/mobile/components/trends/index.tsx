import { ScrollView, View } from 'react-native';

import tw from '../../utils/tailwind';

import TrendContainer from './liveTrends/TrendContainer';
import TrendFilter from './liveTrends/TrendFilter';
import TrendsStatus from './status/TrendsStatus';

const Trends = () => {
  return (
    <ScrollView>
      <View style={tw`flex-col gap-4`}>
        <TrendsStatus />
        <TrendFilter />
        <TrendContainer />
      </View>
    </ScrollView>
  );
};

export default Trends;
