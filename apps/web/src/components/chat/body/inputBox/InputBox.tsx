import ChattingInput from './Input';
import InputIconGroup from './InputIconGroup';

const ChattingInputBox = () => {
  return (
    <div className="sticky bottom-0 w-full bg-white px-4 py-3">
      <div className="mx-auto max-w-3xl border border-gray-300 rounded-4xl px-4 py-2 shadow-sm">
        <div className="flex items-center bg-white ">
          {/* 입력창 */}
          <ChattingInput />
        </div>
        {/* 전송 아이콘들 */}
        <InputIconGroup />
      </div>
    </div>
  );
};

export default ChattingInputBox;
