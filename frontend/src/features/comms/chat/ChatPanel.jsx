// src/components/comms/chat/ChatPanel.jsx
import { useState } from "react";
import ChatListView from "./ChatListView";
import ChatRoomView from "./ChatRoomView";

export default function ChatPanel() {
  const [activeChatKey, setActiveChatKey] = useState(null);

  // Si hay chat activo → mostrar la sala
  if (activeChatKey) {
    return (
      <ChatRoomView
        chatKey={activeChatKey}
        onBack={() => setActiveChatKey(null)}
      />
    );
  }

  // Si no → mostrar la lista de chats
  return (
    <ChatListView onSelectChat={setActiveChatKey} />
  );
}
