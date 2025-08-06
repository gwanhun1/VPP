import AppHeader from '../../components/common/AppHeader';
import Trends from '../../components/trends';
/**
 * 시장 동향 화면
 * - 주식, 암호화폐, 부동산 등의 시장 동향 정보 제공
 * - VPP 디자인 시스템 적용
 */
export default function TrendsScreen() {
  return (
    <>
      <AppHeader title="시장 동향" subtitle="실시간 시장 정보를 확인하세요" />
      <Trends />
    </>
  );
}
