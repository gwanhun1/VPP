import { View } from 'react-native';

import tw from '../../utils/tailwind';

import Alarm from './Alarm';
import Assist from './Assist';
import DarkMode from './DarkMode';
import FeedBack from './FeedBack';
import Language from './Language';
import UserProfile from './UserProfile';

const Setting = () => {
  return (
    <View style={tw`flex-col gap-2`}>
      <UserProfile />
      <Language />
      <Alarm />
      <DarkMode />
      <Assist />
      <FeedBack />
    </View>
  );
};
export default Setting;
