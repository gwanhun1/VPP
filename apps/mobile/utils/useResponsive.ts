import { useWindowDimensions } from 'react-native';

export type ResponsiveInfo = {
  width: number;
  height: number;
  isSmallPhone: boolean; // <360
  isPhone: boolean;      // <768
  isTablet: boolean;     // >=768
  containerMaxWidth: number; // 컨텐츠 최대 가로폭(px)
  horizontalPadding: number; // 좌우 패딩(px)
};

export default function useResponsive(): ResponsiveInfo {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = width < 360;
  const isTablet = width >= 768;
  const isPhone = !isTablet;

  // 컨텐츠 최대폭: 휴대폰은 화면폭의 99%까지, 태블릿은 900
  const containerMaxWidth = isTablet
    ? 900
    : Math.min(780, Math.max(320, Math.round(width * 0.99)));

  // 좌우 패딩을 더 줄여 컨텐츠 확대
  // xs phone: 4, phone: 8, tablet: 12
  const horizontalPadding = isTablet ? 12 : isSmallPhone ? 4 : 8;

  return { width, height, isSmallPhone, isPhone, isTablet, containerMaxWidth, horizontalPadding };
}
