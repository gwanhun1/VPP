import { Text } from '@vpp/shared-ui';
import { ScrollView, View } from 'react-native';

import tw from '../../../utils/tailwind';

import BookmarkCard from './BookmarkCard';

const BookMark = () => {
  return (
    <>
      <Text variant="h5" weight="bold" color="primary">
        북마크한 용어
      </Text>
      <ScrollView style={tw`h-60`}>
        <View style={tw`flex-col`}>
          {BOOKMARK_DATA.map((item, idx) => (
            <View
              key={item.id}
              style={idx !== BOOKMARK_DATA.length - 1 ? tw`mb-1` : undefined}
            >
              <BookmarkCard text={item.text} />
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

export default BookMark;

const BOOKMARK_DATA = [
  { id: 0, text: '북마크한 용어1' },
  { id: 1, text: '북마크한 용어2' },
  { id: 2, text: '북마크한 용어3' },
  { id: 3, text: '북마크한 용어4' },
  { id: 4, text: '북마크한 용어5' },
];
