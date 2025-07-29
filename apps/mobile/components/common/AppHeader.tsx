import { Text } from '@vpp/shared-ui';
import { View } from 'react-native';

import tw from '../../utils/tailwind';

type AppHeaderProps = {
  title: string;
  subtitle: string;
};

const AppHeader = ({ title, subtitle }: AppHeaderProps) => {
  return (
    <View
      style={tw`bg-primary px-md py-3 flex-row flex-col items-center justify-center border-b border-primary-light`}
    >
      <Text variant="h4" weight="bold" color="white">
        {title}
      </Text>
      <Text variant="caption" color="muted">
        {subtitle}
      </Text>
    </View>
  );
};
export default AppHeader;
