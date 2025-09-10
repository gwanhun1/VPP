import { View } from 'react-native';

import tw from '../../utils/tailwind';

import BookMark from './bookmark/BookMark';
import ChattingLog from './chattingLog/ChattingLog';
import MyQuizPage from './myQuizPage/MyQuizPage';
import Recent from './recent/Recent';
import MyPageStatus from './status/MyPageStatus';
import UserProfile from './profile/UserProfile';

const MyPage = () => {
  return (
    <View style={tw`flex-col gap-4`}>
      <UserProfile />
      <MyPageStatus />
      <MyQuizPage />
      <BookMark />
      <Recent />
      <ChattingLog />
    </View>
  );
};

export default MyPage;
