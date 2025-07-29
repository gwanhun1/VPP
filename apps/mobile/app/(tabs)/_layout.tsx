import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { View, SafeAreaView, Platform, StatusBar } from 'react-native';

/**
 * 탭 레이아웃 컴포넌트
 * - VPP 앱의 메인 네비게이션
 * - AI 채팅, 시장 동향, 용어 퀴즈, 마이페이지, 설정 탭으로 구성
 * - VPP 디자인 시스템 색상 적용
 */
export default function TabLayout() {
  // StatusBar 색상 설정을 컴포넌트 마운트 시 적용
  useEffect(() => {
    // 상태바 스타일을 설정 (밝은 배경에는 어두운 콘텐츠, 어두운 배경에는 밝은 콘텐츠)
    StatusBar.setBarStyle('light-content');
    
    // Android에서는 배경색도 설정
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#14287f');
      StatusBar.setTranslucent(true);
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>

      {/* ✅ iOS의 경우 SafeAreaView로 상단 영역 색상 처리 */}
      <SafeAreaView
        style={{
          backgroundColor: '#14287f',
          flex: 0, // iOS에서만 상단 Safe Area 처리
        }}
      />

      {/* 메인 콘텐츠 영역 */}
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#14287f', // VPP 메인 컬러
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
