import { useEffect, useState } from "react";
import { getUserChats, createChat, leaveChat, joinChatByKey } from "../../../services/comms/chat/chat";
import useUserStore from "../../../store/user/userStore";
import NewChatForm from "./NewChatForm";

export default function ChatListView({ onSelectChat }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [joinKey, setJoinKey] = useState("");
  const user = useUserStore((state) => state.user);

  // Carga inicial de chats suscritos
  useEffect(() => {
    async function fetchChats() {
      try {
        const data = await getUserChats();
        const list = Array.isArray(data?.results) ? data.results : [];
        setChats(list);
      } catch (err) {
        console.error("Error cargando chats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchChats();
  }, []);

  const handleCreateChat = async (name) => {
    try {
      const chat = await createChat({ name });
      if (chat?.key) {
        setShowForm(false);
        setChats([chat, ...chats]);
        onSelectChat(chat.key);
      }
    } catch (err) {
      console.error("Error al crear chat:", err.response?.data || err);
      alert("No se pudo crear el chat. Revisa los datos e inténtalo de nuevo.");
    }
  };

  const handleJoinChat = async () => {
    const key = joinKey.trim();
    if (!key) return;
    try {
      const room = await joinChatByKey(key);
      const data = await getUserChats();
      setChats(Array.isArray(data?.results) ? data.results : []);
      setJoinKey("");
      onSelectChat(room.key);
    } catch (err) {
      console.error("Error al suscribirse:", err.response?.data || err);
      alert("Clave inválida o sala no encontrada");
    }
  };

  const handleLeaveChat = async (chatKey) => {
    try {
      await leaveChat(chatKey);
      setChats(chats.filter((c) => c.key !== chatKey));
    } catch (err) {
      console.error("Error al salir del chat:", err.response?.data || err);
      alert("No se pudo abandonar el chat.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">Tus chats</h2>
        {!showForm && (
          <button
            className="text-blue-600 text-sm hover:underline"
            onClick={() => setShowForm(true)}
          >
            + Nuevo
          </button>
        )}
      </div>

      {showForm && (
        <NewChatForm
          onCreate={handleCreateChat}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Formulario de suscripción por key */}
      <div className="p-4 border-b flex gap-2">
        <input
          type="text"
          placeholder="Ingresa la clave del chat"
          value={joinKey}
          onChange={(e) => setJoinKey(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={handleJoinChat}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Suscribirse
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {loading ? (
          <p className="text-sm text-gray-500">Cargando...</p>
        ) : chats.length === 0 ? (
          <p className="text-sm text-gray-500">No tienes chats aún.</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.key}
              className="flex items-center justify-between w-full px-3 py-2 rounded hover:bg-gray-100"
            >
              <button
                onClick={() => onSelectChat(chat.key)}
                className="flex-1 text-left"
              >
                <div className="font-medium">{chat.name || `Chat ${chat.id}`}</div>
                <div className="text-xs text-gray-500">
                  {new Date(chat.updated_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </button>
              <button
                onClick={() => handleLeaveChat(chat.key)}
                className="ml-2 text-red-500 hover:underline text-sm"
              >
                Salir
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
