import ChattingInput from './Input';
import InputIconGroup from './InputIconGroup';
import { useState } from 'react';

const ChattingInputBox = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className=" sticky bottom-0 w-full bg-white px-4 py-3">
      <div
        className={`mx-auto max-w-3xl rounded-4xl px-4 py-2 shadow-sm border ${
          isFocused ? 'border-primary' : 'border-gray-300'
        }`}
      >
        <div className="flex items-center bg-white ">
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
