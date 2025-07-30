import { Text } from '@vpp/shared-ui';
import { useState } from 'react';
import { Switch, View } from 'react-native';

import tw from '../../utils/tailwind';

const AlarmButtonGroup = () => {
  const subColor = tw.color('secondary');

  const [drNoticeEnabled, setDrNoticeEnabled] = useState(false);
  const [marketNoticeEnabled, setMarketNoticeEnabled] = useState(false);
  const [bidNoticeEnabled, setBidNoticeEnabled] = useState(false);

  const toggleDrNotice = () => setDrNoticeEnabled((prev) => !prev);
  const toggleMarketNotice = () => setMarketNoticeEnabled((prev) => !prev);
  const toggleBidNotice = () => setBidNoticeEnabled((prev) => !prev);

  return (
    <View style={tw`flex-col gap-1`}>
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`p-2 py-1`}>
          <Text variant="h6" color="primary">
            DR 공지 알림
          </Text>
          <Text variant="body2" color="muted">
            수요반응 관련 공지사항
          </Text>
        </View>
        <Switch
          value={drNoticeEnabled}
          onValueChange={toggleDrNotice}
          trackColor={{ false: '#e5e7eb', true: subColor }}
        />
      </View>
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`p-2 py-1`}>
          <Text variant="h6" color="primary">
            시장 변동 알림
          </Text>
          <Text variant="body2" color="muted">
            전력시장 가격 변동 소식
          </Text>
        </View>
        <Switch
          value={marketNoticeEnabled}
          onValueChange={toggleMarketNotice}
          trackColor={{ false: '#e5e7eb', true: subColor }}
        />
      </View>
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`p-2 py-1`}>
          <Text variant="h6" color="primary">
            입찰 일정 알림
          </Text>
          <Text variant="body2" color="muted">
            중요한 입찰 마감일 알림
          </Text>
        </View>
        <Switch
          value={bidNoticeEnabled}
          onValueChange={toggleBidNotice}
          trackColor={{ false: '#e5e7eb', true: subColor }}
        />
      </View>
    </View>
  );
};

export default AlarmButtonGroup;
