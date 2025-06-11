// src/features/comms/chat/ChatLauncher.jsx
import { useState, useEffect } from "react";
import useUserStore from "../../../store/user/userStore";
import ChatModal from "./ChatModal";

export default function ChatLauncher() {
  const user = useUserStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Close modal if user logs out
  useEffect(() => {
    if (!user && isOpen) setIsOpen(false);
  }, [user, isOpen]);

  // Hide tooltip after 3s
  useEffect(() => {
    if (!showTooltip) return;
    const timer = setTimeout(() => setShowTooltip(false), 3000);
    return () => clearTimeout(timer);
  }, [showTooltip]);

  const handleClick = () => {
    if (!user) {
      setShowTooltip(true);
      return;
    }
    setIsOpen((open) => !open);
  };

  return (
    <>
      {isOpen && <ChatModal onClose={() => setIsOpen(false)} />}

      <div className="fixed bottom-4 right-4">
        <div className="relative">
          {showTooltip && (
            <div className="absolute -top-15 right-12 w-48 bg-red-500 text-white text-sm px-3 py-2 rounded-lg shadow-lg">
              Please log in to use the chat
            </div>
          )}
          <button
            onClick={handleClick}
            className="w-14 h-14 bg-[#00ff00] text-black rounded-full shadow-[0_4px_10px_rgba(0,255,0,0.3)] hover:bg-[#00ff00]/80 ring-2 ring-[#ff0000] flex items-center justify-center"
          >
            💬
          </button>
        </div>
      </div>
    </>
  );
}
