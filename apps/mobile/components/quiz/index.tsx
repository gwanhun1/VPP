import { View } from 'react-native';

import tw from '../../utils/tailwind';

import QuizContainer from './QuizContainer';

const Quiz = () => {
  return (
    <View style={tw`p-4`}>
      <QuizContainer />
    </View>
  );
};

export default Quiz;
