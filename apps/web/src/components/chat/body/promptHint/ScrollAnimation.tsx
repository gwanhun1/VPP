import React, { useState, useEffect } from 'react';

type ScrollIndicatorProps = {
  visible?: boolean;
};

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  visible = true,
}) => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!visible) return;

    const intervalId = setInterval(() => {
      setIsActive((prev) => !prev);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [visible]);

  if (!visible || !isActive) return null;

  const animationStyle = {
    animation: 'bounceDown 2s ease-in-out 3',
    right: '5%',
  };

  return (
    <>
      <style>{`
        @keyframes bounceDown {
          0%, 100% {
            bottom: 60%;
          }
          50% {
            bottom: 20%;
          }
        }
      `}</style>

      <div
        className="absolute w-5 h-8 flex justify-center items-center opacity-60"
        style={animationStyle}
      >
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 18.75 7.5-7.5 7.5 7.5"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 7.5-7.5 7.5 7.5"
            />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
            />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default ScrollIndicator;
