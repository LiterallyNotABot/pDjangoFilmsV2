import { useState } from "react";
import ChatModal from "./ChatModal";

export default function ChatLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && <ChatModal onClose={() => setIsOpen(false)} />}
      
      <button
        className="fixed bottom-4 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-50 flex items-center justify-center"
        onClick={() => setIsOpen(true)}
      >
        💬
      </button>
    </>
  );
}
