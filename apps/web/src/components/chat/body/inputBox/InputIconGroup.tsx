import { useChatInput } from '@/utils/inputProvider';
import { Button } from '@vpp/shared-ui/components';

const InputIconGroup = () => {
  const { handleSendMessage, inputText } = useChatInput();

  return (
    <div className="flex justify-end items-center gap-2 pl-3 text-gray-600">
      <Button variant="ghost" size="md" rounded="full" isIconOnly>
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
            d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
          />
        </svg>
      </Button>

      <Button
        variant="secondary"
        size="md"
        rounded="full"
        onClick={handleSendMessage}
        disabled={!inputText.trim()}
        isIconOnly
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="white"
          className="w-5 h-5 rotate-[310deg]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12
                     59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
          />
        </svg>
      </Button>
    </div>
  );
};

export default InputIconGroup;
