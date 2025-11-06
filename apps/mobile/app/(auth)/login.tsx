import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Link, router } from 'expo-router';
import tw from '../../utils/tailwind';
import { getFirebaseAuth } from '@vpp/core-logic';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onSubmit = async () => {
    if (!email || !password) {
      Alert.alert('입력 필요', '아이디(이메일)와 비밀번호를 입력하세요.');
      return;
    }
    try {
      setSubmitting(true);
      const auth = getFirebaseAuth();
      if (!auth) throw new Error('Firebase Auth 초기화 실패');
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/(tabs)');
    } catch (e) {
      const msg = e instanceof Error ? e.message : '로그인에 실패했습니다';
      Alert.alert('로그인 오류', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={tw`flex-1 bg-white`}
    >
      <View style={tw`flex-row items-center px-5 pt-12 pb-6 border-b border-gray-100`}> 
        <TouchableOpacity onPress={() => router.back()} style={tw`pr-3 py-2`}> 
          <Text style={tw`text-[#14287f] font-semibold`}>{'‹ 뒤로'}</Text>
        </TouchableOpacity>
        <Text style={tw`flex-1 text-center text-gray-900 font-semibold text-base`}>로그인</Text>
        <View style={tw`w-10`} />
      </View>

      <View style={tw`flex-1 px-6 pt-8`}> 
        <View style={tw`mb-4`}>
          <Text style={tw`mb-2 text-gray-700 text-xs`}>아이디 (이메일)</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            style={tw`border border-gray-300 rounded-xl px-4 py-3 text-gray-900`}
            editable={!submitting}
          />
        </View>

        <View style={tw`mb-6`}>
          <Text style={tw`mb-2 text-gray-700 text-xs`}>비밀번호</Text>
          <TextInput
            secureTextEntry
            placeholder="비밀번호"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            style={tw`border border-gray-300 rounded-xl px-4 py-3 text-gray-900`}
            editable={!submitting}
          />
        </View>

        <TouchableOpacity
          disabled={submitting}
          onPress={onSubmit}
          style={[
            tw`bg-[#14287f] py-3.5 rounded-xl items-center`,
            submitting ? tw`opacity-60` : null,
          ]}
        >
          <Text style={tw`text-white font-semibold`}>
            {submitting ? '로그인 중...' : '로그인'}
          </Text>
        </TouchableOpacity>

        <View style={tw`mt-4 items-center`}>
          <Link href="/(auth)" asChild>
            <TouchableOpacity disabled={submitting}>
              <Text style={tw`text-[#14287f] text-xs`}>취소하고 돌아가기</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={tw`mt-6 flex-row items-center`}>
          <View style={tw`flex-1 h-px bg-gray-200`} />
          <Text style={tw`px-3 text-gray-500 text-xs`}>또는</Text>
          <View style={tw`flex-1 h-px bg-gray-200`} />
        </View>

        <View style={tw`mt-4 items-center`}>
          <TouchableOpacity
            disabled={submitting}
            onPress={() => router.push('/(auth)/signup' as never)}
          >
            <Text style={tw`text-[#14287f] text-xs`}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
