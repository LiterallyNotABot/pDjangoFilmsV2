import { Heart } from "lucide-react";
import { useState } from "react";

export default function LikeButton({ initial = false, onToggle }) {
  const [liked, setLiked] = useState(initial);

  const toggle = () => {
    setLiked(!liked);
    onToggle && onToggle(!liked);
  };

  return (
    <button onClick={toggle}>
      <Heart
        className={`w-6 h-6 transition-colors ${
          liked ? "fill-red-500 stroke-red-500" : "stroke-gray-500"
        }`}
      />
    </button>
  );
}
