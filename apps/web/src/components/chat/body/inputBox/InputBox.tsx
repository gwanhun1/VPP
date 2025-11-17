import ChattingInput from './Input';
import InputIconGroup from './InputIconGroup';
import { useState } from 'react';

const ChattingInputBox = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="sticky bottom-0 px-4 py-3 w-full">
      <div
        className={`mx-auto max-w-3xl rounded-4xl px-4 py-2 shadow-sm border bg-white dark:bg-[#0a1120] ${
          isFocused
            ? 'border-primary-400 dark:border-primary-500'
            : 'border-gray-300 dark:border-neutral-700'
        }`}
      >
        <div className="flex items-center">
          {/* 입력창 */}
          <ChattingInput
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        {/* 전송 아이콘들 */}
        <InputIconGroup />
      </div>
    </div>
  );
};

export default ChattingInputBox;
