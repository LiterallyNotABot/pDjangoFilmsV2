import { useState } from "react";

export default function NewChatForm({ onCreate }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim());
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Nombre del chat"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-3 py-2 rounded flex-1"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 rounded">
        Crear
      </button>
    </form>
  );
}
