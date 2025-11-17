import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Card, Text } from '@vpp/shared-ui';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';

import tw from '../../utils/tailwind';
import { useSettingsStore } from '../hooks/useSettingsStore';

const Language = () => {
  const primaryColor = tw.color('primary');
  const primaryColor600 = tw.color('primary-600') ?? primaryColor;
  const lang = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const darkMode = useSettingsStore((s) => s.darkMode);
  const iconColor = darkMode ? primaryColor600 : primaryColor;

  const [open, setOpen] = useState(false);

  const options = useMemo(
    () =>
      [
        { value: 'ko', label: '한국어' },
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'Français' },
        { value: 'ja', label: '日本語' },
      ] as const,
    []
  );

  const selectedLabel = useMemo(() => {
    const found = options.find((o) => o.value === lang);
    return found ? found.label : '한국어';
  }, [lang, options]);

  const onSelect = (value: (typeof options)[number]['value']) => {
    setLanguage(value);
    setOpen(false);
  };

  return (
    <Card bordered>
      <View style={tw`flex-row items-center gap-2 mb-2`}>
        <View
          style={[
            tw`w-8 p-2 rounded-xl items-center justify-center`,
            {
              backgroundColor: darkMode
                ? '#1f2937'
                : tw.color('gray-200') || '#e5e7eb',
            },
          ]}
        >
          <MaterialIcons name="language" size={16} color={iconColor} />
        </View>
        <Text variant="h6" color="primary" weight="semibold">
          언어 설정
        </Text>
      </View>

      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`p-2`}>
          <Text variant="h6" color="primary">
            언어
          </Text>
          <Text variant="body2" color="muted">
            앱 표시 언어
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => setOpen(true)}
          style={tw`min-w-28 px-3 py-2 rounded-xl border ${
            darkMode ? 'border-gray-700' : 'border-gray-300'
          } flex-row items-center justify-between`}
        >
          <Text color="primary" weight="medium">
            {selectedLabel}
          </Text>
          <MaterialIcons
            name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={20}
            color={iconColor}
          />
        </Pressable>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={tw`flex-1 bg-black/30`}
          onPress={() => setOpen(false)}
        >
          <View style={tw`flex-1 justify-end`}>
            <View style={tw`bg-white rounded-t-2xl p-4 shadow-lg`}>
              <View style={tw`items-center mb-2`}>
                <View style={tw`h-1.5 w-10 bg-gray-300 rounded-full`} />
              </View>
              {options.map((o) => (
                <Pressable
                  key={o.value}
                  onPress={() => onSelect(o.value)}
                  style={tw`flex-row items-center justify-between px-2 py-3 rounded-xl ${
                    lang === o.value ? 'bg-gray-100' : ''
                  }`}
                >
                  <Text
                    variant="h6"
                    color="primary"
                    weight={lang === o.value ? 'bold' : 'normal'}
                  >
                    {o.label}
                  </Text>
                  {lang === o.value ? (
                    <MaterialIcons name="check" size={18} color={iconColor} />
                  ) : null}
                </Pressable>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </Card>
  );
};

export default Language;
