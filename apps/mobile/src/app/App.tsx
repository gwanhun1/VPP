import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

export const App = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.text}>123</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 32, color: '#14287f' }, // 메인 컬러 사용
});

export default App;
