import { useEffect, useState } from "react";
import {
  getUserChats,
  createChat,
  leaveChat,
  joinChatByKey,
} from "../../../services/comms/chat/chat";
import useUserStore from "../../../store/user/userStore";
import NewChatForm from "./NewChatForm";

export default function ChatListView({ onSelectChat }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [joinKey, setJoinKey] = useState("");
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    async function fetchChats() {
      try {
        const data = await getUserChats();
        setChats(Array.isArray(data?.results) ? data.results : []);
      } catch (err) {
        console.error("Error loading chats", err);
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
      console.error("Error creating chat:", err.response?.data || err);
      alert("Could not create chat. Please check your data and try again.");
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
      console.error("Error joining chat:", err.response?.data || err);
      alert("Invalid key or room not found.");
    }
  };

  const handleLeaveChat = async (chatKey) => {
    try {
      await leaveChat(chatKey);
      setChats(chats.filter((c) => c.key !== chatKey));
    } catch (err) {
      console.error("Error leaving chat:", err.response?.data || err);
      alert("Could not leave the chat.");
    }
  };

  return (
    <div className="flex flex-col h-full text-white">
      <div className="p-4 border-b border-[#222222] flex justify-between items-center">
        <h2 className="font-semibold text-lg">Your Chats</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-[#00ff00] text-sm hover:underline"
          >
            + New
          </button>
        )}
      </div>

      {showForm && (
        <NewChatForm
          onCreate={handleCreateChat}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="p-4 border-b border-[#222222] flex gap-2">
        <input
          type="text"
          placeholder="Enter chat key"
          value={joinKey}
          onChange={(e) => setJoinKey(e.target.value)}
          className="border border-[#222222] rounded px-3 py-2 flex-1 bg-[#111111] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff00]"
        />
        <button
          onClick={handleJoinChat}
          className="bg-[#00ff00] hover:bg-[#00ff00]/80 text-[#111111] px-4 py-2 rounded font-medium"
        >
          Join
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="p-4 text-sm text-gray-500">Loading...</p>
        ) : chats.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">You have no chats yet.</p>
        ) : (
          chats.map((chat, idx) => (
            <div key={chat.key}>
              <div className="flex items-center justify-between w-full px-4 py-2 hover:bg-[#222222] transition-colors">
                <button
                  onClick={() => onSelectChat(chat.key)}
                  className="flex-1 text-left"
                >
                  <div className="font-medium text-white">
                    {chat.name || `Chat ${chat.id}`}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(chat.updated_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </button>
                <button
                  onClick={() => handleLeaveChat(chat.key)}
                  className="ml-2 bg-[#ff0000] hover:bg-[#ff0000]/80 text-[#111111] px-2 py-1 rounded text-sm font-medium transition-colors"
                >
                  Leave
                </button>
              </div>
              {idx < chats.length - 1 && (
                <hr className="border-t border-[#222222] mx-4" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
