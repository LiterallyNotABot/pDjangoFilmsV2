// src/features/comms/chat/ChatModal.jsx
import { useEffect, useState } from "react";
import useUserStore from "../../../store/user/userStore";
import ChatListView from "./ChatListView";
import ChatRoomView from "./ChatRoomView";

export default function ChatModal({ onClose }) {
  const user = useUserStore((state) => state.user);
  const [activeChatId, setActiveChatId] = useState(null);

  // Close if user logs out
  useEffect(() => {
    if (!user) onClose();
  }, [user, onClose]);

  return (
    <div className="fixed bottom-3 right-20 w-[20.5rem] h-[30rem] bg-[#111111] border border-[#222222] rounded-lg shadow-lg flex flex-col overflow-hidden z-50 text-white">
      {activeChatId ? (
        <ChatRoomView
          chatKey={activeChatId}
          onBack={() => setActiveChatId(null)}
        />
      ) : (
        <ChatListView onSelectChat={setActiveChatId} />
      )}
    </div>
  );
}
