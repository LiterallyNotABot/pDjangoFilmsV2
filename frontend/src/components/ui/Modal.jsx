import "./Modal.css";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="ui-modal-backdrop">
      <div className="ui-modal">
        <button className="ui-modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}
