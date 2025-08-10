import { ScrollView, View } from 'react-native';

import tw from '../../utils/tailwind';

import Alarm from './Alarm';
import Assist from './Assist';
import DarkMode from './DarkMode';
import FeedBack from './FeedBack';
import Language from './Language';

const Setting = () => {
  return (
    <ScrollView>
      <View style={tw`flex-col gap-2`}>
        <Language />
        <Alarm />
        <DarkMode />
        <Assist />
        <FeedBack />
      </View>
    </ScrollView>
  );
};
export default Setting;
