import { isWeb } from '../../utils/platform';

export type SpinnerProps = {
  size?: number;
  color?: string;
  overlay?: boolean;
  message?: string;
  className?: string; // web 전용 클래스
  variant?: 'indeterminate' | 'determinate';
  value?: number; // 0-100 (determinate에서만)
  thickness?: number; // 원 스트로크 두께
  trackColor?: string; // 트랙 색상
};

const WebSpinner = ({
  size = 40,
  color = '#60A5FA', // 하늘색으로 변경
  overlay = false,
  message,
  className = '',
  variant = 'indeterminate',
  value = 0,
  thickness = 2, // 더 얇게
  trackColor = 'transparent', // 트랙 숨김
}: SpinnerProps) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  // 사진과 같은 부분적 원호 효과
  const arcLength = circumference * 0.25; // 원주의 25%만 표시

  const spinner = (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      <style>
        {`
        @keyframes vpp-spin { 
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); } 
        }
      `}
      </style>
      <svg
        role="progressbar"
        aria-valuemin={variant === 'determinate' ? 0 : undefined}
        aria-valuemax={variant === 'determinate' ? 100 : undefined}
        aria-valuenow={
          variant === 'determinate' ? Math.round(value) : undefined
        }
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        style={{
          display: 'block',
          animation:
            variant === 'indeterminate'
              ? 'vpp-spin 1s linear infinite'
              : undefined,
        }}
      >
        {/* 부분적 원호 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${arcLength.toFixed(3)} ${circumference.toFixed(
            3
          )}`}
          strokeDashoffset={
            variant === 'determinate'
              ? ((100 - Math.max(0, Math.min(100, value))) / 100) *
                circumference
              : 0
          }
          style={{
            transformOrigin: 'center',
          }}
        />
      </svg>
      {message ? (
        <div style={{ marginTop: 8, color: '#475569', fontSize: 12 }}>
          {message}
        </div>
      ) : null}
    </div>
  );

  if (!overlay) return spinner;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(255,255,255,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      {spinner}
    </div>
  );
};

const NativeSpinner = ({
  size = 32,
  color = '#14287f',
  overlay = false,
  message,
}: SpinnerProps) => {
  try {
    const { ActivityIndicator, View, Text } = require('react-native');
    const content = (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator
          size={size <= 24 ? 'small' : 'large'}
          color={color}
        />
        {message ? (
          <Text style={{ marginTop: 8, color: '#475569', fontSize: 12 }}>
            {message}
          </Text>
        ) : null}
      </View>
    );

    if (!overlay) return content;
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.7)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
        pointerEvents="none"
      >
        {content}
      </View>
    );
  } catch {
    return null;
  }
};

const Spinner = isWeb ? WebSpinner : NativeSpinner;

export default Spinner;
