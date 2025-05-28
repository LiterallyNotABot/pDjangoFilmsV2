import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({ max = 5, value = 0, onChange }) {
  const [hover, setHover] = useState(null);

  const handleClick = (index) => {
    onChange && onChange(index + 1);
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, index) => {
        const filled = index < (hover ?? value);
        return (
          <Star
            key={index}
            onMouseEnter={() => setHover(index + 1)}
            onMouseLeave={() => setHover(null)}
            onClick={() => handleClick(index)}
            className={`w-6 h-6 cursor-pointer transition-colors ${
              filled ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-500"
            }`}
          />
        );
      })}
    </div>
  );
}
