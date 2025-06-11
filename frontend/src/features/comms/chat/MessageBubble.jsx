import React from "react";

export default function MessageBubble({ message, isMine }) {
  const bubbleClasses = isMine
    ? "bg-[#00ff00] text-black rounded-br-none"
    : "bg-[#222222] text-white rounded-bl-none";

  return (
    <div className={`flex flex-col max-w-xs my-2 ${isMine ? "items-end" : "items-start"}`}>
      <div className={`${bubbleClasses} px-4 py-2 rounded-xl`}>
        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-xs text-gray-500">{message.user}</span>
        <span className="text-xs text-gray-400">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
