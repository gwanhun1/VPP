import { Button, Text } from '@vpp/shared-ui';

type VoiceModalProps = {
  isListening: boolean;
  stopListening: () => void;
};

const VoiceModal = ({ isListening, stopListening }: VoiceModalProps) => {
  return (
    <div>
      {isListening && (
        <>
          {/* 전체 화면 오버레이 */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={stopListening}
          />

          {/* 중앙 모달 */}
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6 z-50 w-80">
            <div className="flex flex-col items-center gap-4">
              {/* 상단 타이틀 */}
              <div className="w-full flex justify-between items-center">
                <Text variant="h5" className="font-medium">
                  음성 인식 중
                </Text>
                <Button
                  variant="ghost"
                  rounded="full"
                  isIconOnly
                  onClick={stopListening}
                  className="rounded-full hover:bg-neutral-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>

              {/* 마이크 애니메이션 */}
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center relative animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="22"></line>
                </svg>
                <span className="absolute -right-1 -top-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
              </div>

              {/* 안내 텍스트 */}
              <Text variant="body2" color="muted" className="text-center">
                말씀해 주세요.
                <br />
                음성을 텍스트로 변환합니다.
              </Text>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VoiceModal;
