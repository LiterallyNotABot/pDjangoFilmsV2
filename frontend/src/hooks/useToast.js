import { useState } from "react";

export default function useToast() {
  const [message, setMessage] = useState(null);

  const showToast = (text, duration = 3000) => {
    setMessage(text);
    setTimeout(() => {
      setMessage(null);
    }, duration);
  };

  return { message, showToast };
}
