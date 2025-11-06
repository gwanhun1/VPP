import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { View, SafeAreaView, Platform, StatusBar } from 'react-native';

export default function TabLayout() {
  useEffect(() => {
    StatusBar.setBarStyle('light-content');

    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#14287f');
      StatusBar.setTranslucent(true);
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          backgroundColor: '#14287f',
          flex: 0,
        }}
      />

      {/* 메인 콘텐츠 영역 */}
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#14287f',
            tabBarInactiveTintColor: '#666666',
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopColor: '#e0e0e0',
              paddingBottom: Platform.OS === 'ios' ? 5 : 10,
              height: Platform.OS === 'ios' ? 60 : 65,
            },
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '500',
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'AI 채팅',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="chatbubble-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="trends"
            options={{
              title: '시장 동향',
              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name="trending-up-outline"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="quiz"
            options={{
              title: '용어 퀴즈',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="book-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="mypage"
            options={{
              title: '마이페이지',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: '설정',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings-outline" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>

      {/* ✅ iOS 하단 Safe Area 처리 */}
      <SafeAreaView
        style={{
          backgroundColor: '#ffffff',
          flex: 0,
        }}
      />
    </View>
  );
}
