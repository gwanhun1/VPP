import { Text } from '@vpp/shared-ui';
import { Switch, View } from 'react-native';

import tw from '../../utils/tailwind';
import { useSettingsStore } from '../hooks/useSettingsStore';

const AlarmButtonGroup = () => {
  const subColor = tw.color('secondary');
  const alarms = useSettingsStore((s) => s.alarms);
  const setAlarm = useSettingsStore((s) => s.setAlarm);
  const toggleDrNotice = () =>
    setAlarm('drNoticeEnabled', !alarms.drNoticeEnabled);
  const toggleMarketNotice = () =>
    setAlarm('marketNoticeEnabled', !alarms.marketNoticeEnabled);
  const toggleBidNotice = () =>
    setAlarm('bidNoticeEnabled', !alarms.bidNoticeEnabled);

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
          value={alarms.drNoticeEnabled}
          onValueChange={toggleDrNotice}
          trackColor={{ false: '#e5e7eb', true: subColor }}
          disabled
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
          value={alarms.marketNoticeEnabled}
          onValueChange={toggleMarketNotice}
          trackColor={{ false: '#e5e7eb', true: subColor }}
          disabled
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
          value={alarms.bidNoticeEnabled}
          onValueChange={toggleBidNotice}
          trackColor={{ false: '#e5e7eb', true: subColor }}
          disabled
        />
      </View>
    </View>
  );
};

export default AlarmButtonGroup;
