export default function MessageBubble({ message, isMine }) {
  const bubbleClasses = isMine
    ? "bg-blue-500 text-white ml-auto rounded-br-none"
    : "bg-gray-200 text-gray-900 mr-auto rounded-bl-none";

  const alignment = isMine ? "items-end text-right" : "items-start text-left";

  return (
    <div className={`flex flex-col ${alignment} max-w-xs`}>
      <div className={`px-4 py-2 rounded-lg ${bubbleClasses}`}>
        <p className="text-sm">{message.content}</p>
      </div>
      <span className="text-xs text-gray-400 mt-1">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
