import { useState, useEffect } from 'react';
import ChattingPage from '../components/chat/ChattingPage';
import { WebLoginModal } from '../components/auth/WebLoginModal';
import { useAuth } from '../contexts/AuthContext';
import type { AuthUser } from '@vpp/core-logic';

export function App() {
  const { authUser, isWebView, firebaseReady, isLoading, login } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 디버깅용 로그
  console.log('App 상태:', { authUser: !!authUser, isWebView, firebaseReady, isLoading });

  useEffect(() => {
    // 웹뷰가 아닌 환경에서만 로그인 모달 표시 로직 실행
    if (!isWebView && firebaseReady && !isLoading) {
      if (!authUser) {
        setShowLoginModal(true);
      }
    }
  }, [authUser, isWebView, firebaseReady, isLoading]);

  const handleLoginSuccess = (user: AuthUser) => {
    if (login) {
      login(user);
    }
    setShowLoginModal(false);
  };

  // 웹뷰가 아닌 환경에서 로그인되지 않은 경우 로그인 모달만 표시
  if (!isWebView && firebaseReady && !isLoading && !authUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">VPP 웹 서비스</h1>
          <p className="mb-4 text-gray-600">로그인이 필요합니다.</p>
        </div>
        <WebLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  // 로딩 중일 때
  if (!isWebView && isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="mx-auto mb-4 w-8 h-8 rounded-full border-b-2 border-blue-600 animate-spin"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ChattingPage />
    </div>
  );
}

export default App;
