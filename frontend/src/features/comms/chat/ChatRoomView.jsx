import React, { useState, useEffect, useCallback } from "react";
import { getChatMessages, getUserChats, joinChatByKey } from "@/services/comms/chat/chat";
import useUserStore from "@/store/user/userStore";
import { useChatSocket } from "@/hooks/useChatSocket";
import { ArrowLeft } from "lucide-react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

export default function ChatRoomView({ chatKey, onBack }) {
  const [roomInfo, setRoomInfo] = useState({ name: "", key: chatKey });
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    if (!chatKey) return;
    (async () => {
      try {
        const data = await getUserChats();
        const list = Array.isArray(data?.results) ? data.results : [];
        const room = list.find((c) => c.key === chatKey);
        if (room) setRoomInfo({ name: room.name, key: room.key });
      } catch (err) {
        console.error("Error loading room info:", err);
      }
    })();
  }, [chatKey]);

  const handleIncoming = useCallback(
    (payload) => {
      setMessages((prev) => [
        ...prev,
        {
          id: payload.id,
          message: payload.message,
          timestamp: payload.timestamp,
          user: payload.user,
          sender: payload.user === user.username ? "me" : "other",
        },
      ]);
    },
    [user.username]
  );
  const handleOpen  = useCallback(() => setConnected(true), []);
  const handleClose = useCallback(() => setConnected(false), []);

  const { sendMessage } = useChatSocket(chatKey, handleIncoming, handleOpen, handleClose);

  useEffect(() => {
    if (!chatKey) return;
    const abortCtrl = new AbortController();
    (async () => {
      try {
        await joinChatByKey(chatKey);
        const data = await getChatMessages(chatKey, abortCtrl.signal);
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];
        const history = list.map((msg) => ({
          ...msg,
          sender: msg.user === user.username ? "me" : "other",
        }));
        setMessages(history);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    })();
    return () => abortCtrl.abort();
  }, [chatKey, user.username]);

  const handleSend = (text) => {
    if (!text.trim() || !connected) return;
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="flex items-center p-4 border-b border-[#222222] bg-[#000000]">
        <ArrowLeft
          onClick={onBack}
          className="w-6 h-6 text-[#00ff00] cursor-pointer mr-3 hover:text-[#00ff00]/80 transition-colors"
        />
        <div>
          <h1 className="text-xl font-bold text-white">
            {roomInfo.name || "Chat Room"}
          </h1>
          <span className="text-xs text-[#ff0000]">
            Key: {roomInfo.key}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-[#000000]">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMine={msg.sender === "me"}
          />
        ))}
      </div>

      <div className="p-4 border-t border-[#222222] bg-[#000000]">
        <ChatInput
          onSend={handleSend}
          disabled={!connected}
          placeholder={
            connected ? "Type a message..." : "Connecting to chat..."
          }
        />
      </div>
    </div>
  );
}
