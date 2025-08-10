import { ScrollView, View } from 'react-native';

import tw from '../../utils/tailwind';
import useResponsive from '../../utils/useResponsive';

import TrendContainer from './liveTrends/TrendContainer';
import TrendFilter from './liveTrends/TrendFilter';
import TrendsStatus from './status/TrendsStatus';

const Trends = () => {
  const { containerMaxWidth, horizontalPadding } = useResponsive();
  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: containerMaxWidth, paddingHorizontal: horizontalPadding }}>
        <View style={tw`flex-col gap-4`}>
          <TrendsStatus />
          <TrendFilter />
          <TrendContainer />
        </View>
      </View>
    </ScrollView>
  );
};

export default Trends;
