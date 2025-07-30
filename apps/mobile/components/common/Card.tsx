import { View } from 'react-native';

import tw from '../../utils/tailwind';

const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={tw`p-4 border border-gray-200 rounded-lg`}>{children}</View>
  );
};

export default Card;
