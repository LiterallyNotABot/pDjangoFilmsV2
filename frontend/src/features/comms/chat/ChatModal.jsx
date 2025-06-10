// src/features/comms/chat/ChatModal.jsx
import { useState } from "react";
import ChatListView from "./ChatListView";
import ChatRoomView from "./ChatRoomView";

export default function ChatModal({ onClose }) {
  const [activeChatId, setActiveChatId] = useState(null);

  return (
    <div className="fixed bottom-0 right-0 w-82 h-120 bg-white border rounded-t-lg shadow-lg flex flex-col overflow-hidden z-50">
      <div className="absolute top-2 right-2">
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        )}
      </div>

      {activeChatId ? (
        (
          <ChatRoomView
            chatKey={activeChatId}
            onBack={() => setActiveChatId(null)}
          />
        )
      ) : (
        <ChatListView onSelectChat={setActiveChatId} />
      )}
    </div>
  );
}
