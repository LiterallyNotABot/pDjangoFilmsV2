// src/features/comms/chat/ChatRoomView.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  getChatMessages,
  joinChatByKey,
  leaveChat,
} from "@/services/comms/chat/chat";
import useUserStore from "@/store/user/userStore";
import { useChatSocket } from "@/hooks/useChatSocket";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

export default function ChatRoomView({ chatKey }) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const { user } = useUserStore();

  // WS callbacks (estables con useCallback)
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
  const handleOpen = useCallback(() => setConnected(true), []);
  const handleClose = useCallback(() => setConnected(false), []);

  // Hook de WS (no lo toques)
  const { sendMessage } = useChatSocket(
    chatKey,
    handleIncoming,
    handleOpen,
    handleClose
  );

  // Join + fetch history
  useEffect(() => {
    if (!chatKey) return;
    const abortCtrl = new AbortController();

    (async () => {
      try {
        await joinChatByKey(chatKey);
        const data = await getChatMessages(chatKey);
        // guard robusto: si vienen paginados, toma `.results`; si es array, úsalo; si no, vacío
        const list = Array.isArray(data)
          ? data
          : data?.results instanceof Array
            ? data.results
            : [];
        const history = (Array.isArray(data) ? data : (data.results ?? [])).map(
          (msg) => ({
            ...msg,
            sender: msg.user === user.username ? "me" : "other",
          })
        );
        setMessages(history);
      } catch (err) {
        console.error("ChatRoomView fetch error:", err);
      }
    })();

    return () => {
      leaveChat(chatKey).catch(console.error);
    };
  }, [chatKey, user.username]);

  // Envío de mensajes (optimista + WS)
  // Envío de mensajes (solo WS)
  const handleSend = (text) => {
    if (!text.trim() || !connected) return;
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMine={msg.sender === "me"}
          />
        ))}
      </div>
      <div className="p-4 border-t">
        <ChatInput
          onSend={handleSend}
          disabled={!connected}
          placeholder={
            connected ? "Escribe un mensaje..." : "Conectando al chat..."
          }
        />
      </div>
    </div>
  );
}
