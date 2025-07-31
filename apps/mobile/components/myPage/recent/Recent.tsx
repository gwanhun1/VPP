import { Text } from '@vpp/shared-ui';
import { ScrollView, View } from 'react-native';

import tw from '../../../utils/tailwind';

import RecentCard from './RecentCard';

const Recent = () => {
  return (
    <>
      <Text variant="h5" weight="bold" color="primary">
        최근 본 용어
      </Text>
      <ScrollView style={tw`h-60`}>
        <View style={tw`flex-col`}>
          {RECENT_DATA.map((item, idx) => (
            <View
              key={item.id}
              style={idx !== RECENT_DATA.length - 1 ? tw`mb-1` : undefined}
            >
              <RecentCard text={item.text} />
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

export default Recent;

const RECENT_DATA = [
  { id: 0, text: '용어1' },
  { id: 1, text: '용어2' },
  { id: 2, text: '용어3' },
  { id: 3, text: '용어4' },
  { id: 4, text: '용어5' },
];
