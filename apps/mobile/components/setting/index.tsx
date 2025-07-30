import { View } from 'react-native';

import tw from '../../utils/tailwind';

import Alarm from './Alarm';
import DarkMode from './DarkMode';
import Language from './Language';

const Setting = () => {
  return (
    <View style={tw`flex-1 p-4 gap-2`}>
      <Language />
      <Alarm />
      <DarkMode />
    </View>
  );
};
export default Setting;
