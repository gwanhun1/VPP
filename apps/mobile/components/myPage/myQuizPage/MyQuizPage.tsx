import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Card, CardHeader, Text } from '@vpp/shared-ui';
import { View } from 'react-native';

import tw from '../../../utils/tailwind';

import QuizResponse from './QuizResponse';

const MyQuizPage = () => {
  const primaryColor = tw.color('primary');

  return (
    <Card bordered>
      <CardHeader>
        <View style={tw`flex-row items-center gap-2`}>
          <MaterialCommunityIcons
            name="medal-outline"
            size={24}
            color={primaryColor}
          />
          <Text variant="h5" weight="semibold" color="primary">
            퀴즈 성과
          </Text>
        </View>
      </CardHeader>
      <QuizResponse />
    </Card>
  );
};

export default MyQuizPage;
