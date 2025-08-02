import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useQuiz } from '../../utils/QuizProvider';
import tw from '../../utils/tailwind';

const GaugeBar = () => {
  const { step, question } = useQuiz();
  const progress = (step / question?.length) * 100;
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: Math.min(Math.max(progress, 0), 100),
      duration: 500, // 0.5초 애니메이션
      useNativeDriver: false, // width 애니메이션은 native driver 사용 불가
    }).start();
  }, [progress, animatedWidth]);

  return (
    <View style={tw`w-full h-2 bg-gray-200 overflow-hidden`}>
      <Animated.View
        style={[
          tw`h-2 bg-secondary`,
          {
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
};

export default GaugeBar;
