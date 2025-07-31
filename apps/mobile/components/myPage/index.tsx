import { ScrollView, View } from 'react-native';

import tw from '../../utils/tailwind';

import BookMark from './bookmark/BookMark';
import ChattingLog from './chattingLog/ChattingLog';
import MyQuizPage from './myQuizPage/MyQuizPage';
import Recent from './recent/Recent';
import MyPageStatus from './status/MyPageStatus';

const MyPage = () => {
  return (
    <ScrollView style={tw`p-4`}>
      <View style={tw`flex-col gap-4`}>
        <MyPageStatus />
        <MyQuizPage />
        <BookMark />
        <Recent />
        <ChattingLog />
      </View>
    </ScrollView>
  );
};

export default MyPage;
