// src/features/comms/chat/ChatRoomView.jsx
import { useEffect, useRef, useState } from "react";
import api from "@/services/axios"; // tu instancia axios con baseURL y auth interceptor
import { getAccessToken } from "@/services/auth";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

export default function ChatRoomView({ chatKey, onBack }) {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const token     = getAccessToken();

  useEffect(() => {
    if (!chatKey || !token) return;

    let mounted = true;
    let ws;

    (async () => {
      try {
        // 1) Únete primero
        await api.post("/comms/chats/join/", { key: chatKey });

        // 2) Carga los mensajes
        const { data } = await api.get(
          `/comms/chats/${chatKey}/messages/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const list = Array.isArray(data) ? data : data.results ?? [];
        if (mounted) setMessages(list);
      } catch (err) {
        console.error("ChatRoomView setup:", err.response?.data || err);
        return;
      }

      // 3) Abre una sola vez el WebSocket
      try {
        const u = new URL(api.defaults.baseURL);
        u.protocol = u.protocol === "https:" ? "wss:" : "ws:";
        u.pathname = `/ws/chat/${chatKey}/`;
        u.search   = `?token=${token}`;
        ws = new WebSocket(u.toString());
        socketRef.current = ws;
      } catch (err) {
        console.error("WebSocket URL inválida:", err);
        return;
      }

      ws.onopen = () => console.log("WS abierto");
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (mounted) setMessages((prev) => [...prev, msg]);
        } catch {}
      };
      ws.onclose = (e) => console.log("WS cerrado", e.code);
    })();

    return () => {
      mounted = false;
      if (socketRef.current) socketRef.current.close();
    };
  }, [chatKey, token]);

  // 4) Enviar mensajes
  const handleSend = (text) => {
    const sock = socketRef.current;
    if (sock?.readyState === WebSocket.OPEN) {
      sock.send(JSON.stringify({ type: "chat_message", message: text }));
      // optimista
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "me",
          message: text,
          timestamp: new Date().toISOString(),
        },
      ]);
    } else {
      console.error("WS no está abierto:", sock?.readyState);
    }
  };

  // Scroll al final
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <button onClick={onBack} className="text-blue-500 hover:underline">
          ← Volver
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m, idx) => (
          <MessageBubble
            key={m.id ?? idx}
            message={m}
            isMine={m.sender === "me"}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
