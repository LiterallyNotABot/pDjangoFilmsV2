// src/features/comms/chat/MessageBubble.jsx
import React from 'react';

export default function MessageBubble({ message, isMine }) {
  const bubbleClasses = isMine
    ? 'bg-blue-500 text-white rounded-br-none'
    : 'bg-gray-200 text-gray-900 rounded-bl-none';

  return (
    <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-xs my-2`}>
      <div className={`${isMine ? 'ml-auto' : 'mr-auto'} px-4 py-2 rounded-xl ${bubbleClasses}`}>
        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
      </div>
      <span className="text-xs text-gray-500 mt-1">{message.user}</span>
      <span className="text-xs text-gray-400 mt-1">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
