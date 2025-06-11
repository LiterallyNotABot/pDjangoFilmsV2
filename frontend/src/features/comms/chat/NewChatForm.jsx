import React, { useState } from "react";

export default function NewChatForm({ onCreate, onCancel }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) onCreate(trimmed);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-[#111111] border-b border-[#222222] flex flex-col gap-4"
    >
      <label className="text-white text-sm flex items-center gap-2">
        Chat Name:
        <input
          type="text"
          placeholder="Enter chat name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border border-[#222222] bg-[#000000] text-white rounded px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff00]"
        />
      </label>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-[#ff0000] hover:bg-[#ff0000]/80 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-[#00ff00] hover:bg-[#00ff00]/80 text-black px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          Create
        </button>
      </div>
    </form>
  );
}
