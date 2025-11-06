import { isWeb, cn } from '../../utils/platform';

const WebInput = ({
  variant = 'default',
  size = 'md',
  fullWidth = false,
  disabled = false,
  error = false,
  success = false,
  helperText,
  label,
  placeholder,
  className = '',
  inputClassName = '',
  ...props
}: InputProps) => {
  const baseInputClasses =
    'rounded border transition-all focus:outline-none focus:ring-2';

  const variantClasses = {
    default:
      'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20',
    filled:
      'bg-neutral-100 border-transparent focus:bg-white focus:border-primary-500',
    flushed:
      'border-0 border-b rounded-none border-neutral-300 focus:border-primary-500',
  };

  const sizeClasses = {
    xs: 'text-xs py-1 px-2',
    sm: 'text-sm py-1.5 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-2.5 px-5',
  };

  const stateClasses = {
    disabled: 'opacity-60 cursor-not-allowed bg-neutral-50',
    error: 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
    success:
      'border-success-500 focus:border-success-500 focus:ring-success-500/20',
    fullWidth: 'w-full',
  };

  const inputClasses = cn(
    baseInputClasses,
    variantClasses[variant as keyof typeof variantClasses],
    sizeClasses[size as keyof typeof sizeClasses],
    disabled && stateClasses.disabled,
    error && stateClasses.error,
    success && stateClasses.success,
    fullWidth && stateClasses.fullWidth,
    inputClassName
  );

  const wrapperClasses = cn('flex flex-col', fullWidth && 'w-full', className);

  const helperTextClasses = cn(
    'text-xs mt-1',
    error ? 'text-error' : success ? 'text-success' : 'text-neutral-500'
  );

  return (
    <div className={wrapperClasses}>
      {label && (
        <label className="mb-1 text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <input
        className={inputClasses}
        disabled={disabled}
        placeholder={placeholder}
        {...props}
      />
      {helperText && <p className={helperTextClasses}>{helperText}</p>}
    </div>
  );
};

const NativeInput = ({
  variant = 'default',
  size = 'md',
  fullWidth = false,
  disabled = false,
  error = false,
  success = false,
  helperText,
  label,
  placeholder,
  ...props
}: InputProps) => {
  try {
    const { View, TextInput, Text } = require('react-native');

    const sizeStyles = {
      xs: { fontSize: 12, paddingVertical: 4, paddingHorizontal: 8 },
      sm: { fontSize: 14, paddingVertical: 6, paddingHorizontal: 12 },
      md: { fontSize: 16, paddingVertical: 8, paddingHorizontal: 16 },
      lg: { fontSize: 18, paddingVertical: 10, paddingHorizontal: 20 },
    };

    const variantStyles = {
      default: {
        borderWidth: 1,
        borderColor: '#cbd5e1',
        backgroundColor: '#ffffff',
        borderRadius: 6,
      },
      filled: {
        borderWidth: 1,
        borderColor: 'transparent',
        backgroundColor: '#f1f5f9',
        borderRadius: 6,
      },
      flushed: {
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#cbd5e1',
        backgroundColor: 'transparent',
        borderRadius: 0,
      },
    };

    let inputStyle = {
      ...variantStyles[variant],
      ...sizeStyles[size],
      color: '#1e293b',
    };

    if (error) {
      inputStyle = { ...inputStyle, borderColor: '#ef4444' };
    } else if (success) {
      inputStyle = { ...inputStyle, borderColor: '#10b981' };
    }

    const containerStyle = {
      width: fullWidth ? '100%' : undefined,
      ...(disabled ? { opacity: 0.6 } : {}),
    };

    if (disabled) {
      inputStyle = {
        ...inputStyle,
        backgroundColor: '#f8fafc',
      };
    }

    const labelStyle = {
      fontSize: 14,
      fontWeight: '500',
      color: '#374151',
      marginBottom: 4,
    };

    const helperTextStyle = {
      fontSize: 12,
      color: error ? '#ef4444' : success ? '#10b981' : '#6b7280',
      marginTop: 4,
    };

    return (
      <View style={containerStyle}>
        {label && <Text style={labelStyle}>{label}</Text>}
        <TextInput
          style={inputStyle}
          placeholder={placeholder}
          editable={!disabled}
          placeholderTextColor="#9ca3af"
          {...props}
        />
        {helperText && <Text style={helperTextStyle}>{helperText}</Text>}
      </View>
    );
  } catch {
    return null;
  }
};

export type InputProps = {
  /**
   * 입력 변형
   * @default 'default'
   */
  variant?: 'default' | 'filled' | 'flushed';

  /**
   * 입력 크기
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';

  /**
   * 전체 너비 사용 여부
   * @default false
   */
  fullWidth?: boolean;

  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean;

  /**
   * 오류 상태
   * @default false
   */
  error?: boolean;

  /**
   * 성공 상태
   * @default false
   */
  success?: boolean;

  /**
   * 도움말 텍스트
   */
  helperText?: string;

  /**
   * 레이블
   */
  label?: string;

  /**
   * 플레이스홀더
   */
  placeholder?: string;

  /**
   * 추가 래퍼 클래스명
   */
  className?: string;

  /**
   * 추가 입력 클래스명
   */
  inputClassName?: string;

  /**
   * 값
   */
  value?: string;

  /**
   * 기본값
   */
  defaultValue?: string;

  /**
   * 변경 핸들러
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * 타입
   */
  type?: string;
};

/**
 * 플랫폼에 따라 적절한 입력 컴포넌트를 내보냄
 */
const Input = isWeb ? WebInput : NativeInput;

export default Input;
