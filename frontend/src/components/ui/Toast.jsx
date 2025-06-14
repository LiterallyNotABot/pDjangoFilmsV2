export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-white px-6 py-3 rounded-full shadow-lg border border-green-500 z-50">
      {message}
    </div>
  );
}
