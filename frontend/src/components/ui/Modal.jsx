// components/ui/Modal.jsx
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-[90%] max-w-md">
        <button className="float-right text-red-500" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
}
