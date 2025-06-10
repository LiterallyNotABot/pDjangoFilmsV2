// src/hooks/useChatSocket.js
import { useEffect, useRef } from "react";
import api from "@/services/axios";          // instancia axios con baseURL apuntando al backend
import { getAccessToken } from "@/services/auth";

export function useChatSocket(chatKey, onMessage, onOpen, onClose) {
  const token = getAccessToken();
  const socketRef = useRef(null);

  // Refs para los callbacks, así no cambian nunca el useEffect
  const onMessageRef = useRef(onMessage);
  const onOpenRef    = useRef(onOpen);
  const onCloseRef   = useRef(onClose);

  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);
  useEffect(() => { onOpenRef.current    = onOpen;    }, [onOpen]);
  useEffect(() => { onCloseRef.current   = onClose;   }, [onClose]);

  useEffect(() => {
    if (!chatKey) return console.error("useChatSocket: falta chatKey");
    if (!token)   return console.error("useChatSocket: falta JWT");

    // Construye ws://localhost:8000/ws/chat/<chatKey>/?token=…
    const apiUrl = api.defaults.baseURL;
    const u      = new URL(apiUrl);
    u.protocol   = u.protocol === "https:" ? "wss:" : "ws:";
    u.pathname   = `/ws/chat/${chatKey}/`;
    u.search     = `?token=${token}`;
    const wsUrl  = u.toString();

    console.log("useChatSocket: abriendo WS en", wsUrl);
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen    = (e) => onOpenRef.current?.(e);
    ws.onmessage = (e) => {
      try {
        onMessageRef.current?.(JSON.parse(e.data));
      } catch {}
    };
    ws.onclose   = (e) => onCloseRef.current?.(e);

    return () => {
      console.log("useChatSocket: cerrando WS");
      ws.close();
      socketRef.current = null;
    };
  }, [chatKey, token]);  // Sólo se vuelve a ejecutar al cambiar de sala o token

  const sendMessage = (message) => {
    const sock = socketRef.current;
    if (sock?.readyState === WebSocket.OPEN) {
      sock.send(JSON.stringify({ type: "chat_message", message }));
    } else {
      console.error("useChatSocket: WS no está abierto:", sock?.readyState);
    }
  };

  return { sendMessage };
}
