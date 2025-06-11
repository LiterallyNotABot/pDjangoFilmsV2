import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSend(value.trim());
      setValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Type a message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 border border-[#222222] bg-[#111111] text-white rounded px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff00]"
      />
      <button
        type="submit"
        className="bg-[#00ff00] hover:bg-[#00ff00]/80 text-black px-4 py-2 rounded text-sm font-medium transition-colors"
      >
        Send
      </button>
    </form>
  );
}
