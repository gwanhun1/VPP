import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import tw from '../../utils/tailwind';
import { getFirebaseAuth } from '@vpp/core-logic';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignupScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onSubmit = async (): Promise<void> => {
    if (!email || !password || !password2) {
      Alert.alert('입력 필요', '이메일과 비밀번호를 모두 입력하세요.');
      return;
    }
    if (password !== password2) {
      Alert.alert('확인 필요', '비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      setSubmitting(true);
      const auth = getFirebaseAuth();
      if (!auth) throw new Error('Firebase Auth 초기화 실패');
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/(tabs)');
    } catch (e) {
      const msg = e instanceof Error ? e.message : '회원가입에 실패했습니다';
      Alert.alert('회원가입 오류', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={tw`flex-1 bg-white`}
    >
      <View
        style={tw`flex-row items-center px-5 pt-12 pb-6 border-b border-gray-100`}
      >
        <TouchableOpacity onPress={() => router.back()} style={tw`pr-3 py-2`}>
          <Text style={tw`text-[#14287f] font-semibold`}>{'‹ 뒤로'}</Text>
        </TouchableOpacity>
        <Text
          style={tw`flex-1 text-center text-gray-900 font-semibold text-base`}
        >
          회원가입
        </Text>
        <View style={tw`w-10`} />
      </View>

      <View style={tw`flex-1 px-6 pt-8`}>
        <View style={tw`mb-4`}>
          <Text style={tw`mb-2 text-gray-700 text-xs`}>이메일</Text>
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

        <View style={tw`mb-4`}>
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

        <View style={tw`mb-6`}>
          <Text style={tw`mb-2 text-gray-700 text-xs`}>비밀번호 확인</Text>
          <TextInput
            secureTextEntry
            placeholder="비밀번호 확인"
            placeholderTextColor="#9CA3AF"
            value={password2}
            onChangeText={setPassword2}
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
            {submitting ? '가입 중...' : '회원가입'}
          </Text>
        </TouchableOpacity>

        <View style={tw`mt-4 items-center`}>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity disabled={submitting}>
              <Text style={tw`text-[#14287f] text-xs`}>
                이미 계정이 있으신가요? 로그인
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
