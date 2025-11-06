import { Text } from '@vpp/shared-ui';
import React from 'react';
import { Pressable, ViewStyle, View } from 'react-native';

import tw from '../../utils/tailwind';

export type QuizActionButtonProps = {
  variant?: 'primary' | 'outline' | 'secondary';
  disabled?: boolean;
  rounded?: 'full' | 'lg' | 'md';
  onPress?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
};

const getContainerStyle = (
  variant: NonNullable<QuizActionButtonProps['variant']>,
  rounded: NonNullable<QuizActionButtonProps['rounded']>,
  disabled: boolean,
  fullWidth?: boolean
): ViewStyle => {
  const base = tw`h-12 px-4 flex-row items-center justify-center`;

  const roundedStyle =
    rounded === 'full'
      ? tw`rounded-full`
      : rounded === 'lg'
      ? tw`rounded-lg`
      : tw`rounded-md`;

  const variantStyle =
    variant === 'primary'
      ? tw`bg-primary`
      : variant === 'secondary'
      ? tw`bg-secondary`
      : tw`bg-transparent border border-primary`;

  const widthStyle = fullWidth ? tw`w-full` : ({} as ViewStyle);
  const disabledStyle = disabled ? tw`opacity-50` : ({} as ViewStyle);
  const shadow = variant !== 'outline' ? tw`shadow` : ({} as ViewStyle);

  return {
    ...base,
    ...roundedStyle,
    ...variantStyle,
    ...widthStyle,
    ...disabledStyle,
    ...shadow,
  } as ViewStyle;
};

const getTextColor = (
  variant: NonNullable<QuizActionButtonProps['variant']>
) => {
  if (variant === 'outline') return 'primary' as const;
  return 'white' as const;
};

export default function QuizActionButton({
  variant = 'primary',
  rounded = 'full',
  disabled = false,
  onPress,
  leftIcon,
  rightIcon,
  children,
  fullWidth = false,
}: QuizActionButtonProps) {
  const containerStyle = getContainerStyle(
    variant,
    rounded,
    disabled,
    fullWidth
  );
  const textColor = getTextColor(variant);

  return (
    <Pressable
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: '#e5e7eb' }}
    >
      <View style={tw`flex-row items-center gap-1`}>
        {leftIcon}
        <Text variant="body" weight="bold" color={textColor}>
          {children}
        </Text>
        {rightIcon}
      </View>
    </Pressable>
  );
}
