import AppHeader from '../../components/common/AppHeader';
import MyPage from '../../components/myPage';

/**
 * 마이페이지 화면
 * - 사용자 프로필 및 개인 설정
 * - 투자 포트폴리오, 관심 종목, 학습 진도 등
 * - VPP 디자인 시스템 적용
 */
export default function MyPageScreen() {
  return (
    <>
      <AppHeader title="마이페이지" subtitle="나만의 전력시장 학습 공간" />
      <MyPage />
    </>
  );
}
