import { Text } from '@vpp/shared-ui';
import { ScrollView, View } from 'react-native';

import tw from '../../../utils/tailwind';

import ChattingLogCard from './ChattingLogCard';

const ChattingLog = () => {
  return (
    <>
      <Text variant="h5" weight="bold" color="primary">
        AI 채팅 기록
      </Text>
      <ScrollView style={tw`h-60`}>
        <View style={tw`flex-col`}>
          {CHATTING_LOG_DATA.map((item, idx) => (
            <View
              key={item.id}
              style={
                idx !== CHATTING_LOG_DATA.length - 1 ? tw`mb-1` : undefined
              }
            >
              <ChattingLogCard text={item.text} time={item.time} />
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

export default ChattingLog;

const CHATTING_LOG_DATA = [
  {
    id: 0,
    text: '채팅1',
    time: 'Wed Jul 30 2025 15:23:45 GMT+0900 (Korean Standard Time)',
  },
  {
    id: 1,
    text: '채팅2',
    time: 'Wed Jul 27 2025 15:23:45 GMT+0900 (Korean Standard Time)',
  },
  {
    id: 2,
    text: '채팅3',
    time: 'Wed Jul 26 2025 15:23:45 GMT+0900 (Korean Standard Time)',
  },
  {
    id: 3,
    text: '채팅4',
    time: 'Wed Jul 30 2025 15:23:45 GMT+0900 (Korean Standard Time)',
  },
  {
    id: 4,
    text: '채팅5',
    time: 'Wed Jul 31 2025 12:23:45 GMT+0900 (Korean Standard Time)',
  },
];
