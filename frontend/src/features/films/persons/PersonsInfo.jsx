import { useState } from "react";

export default function PersonInfo({ person }) {
  const [expanded, setExpanded] = useState(false);
  const toggleBio = () => setExpanded(!expanded);

  return (
    <div className="text-sm text-gray-300 max-w-md text-left">
      {person.biography && (
        <>
          <p
            className={`transition-all duration-300 ${
              expanded ? "line-clamp-none" : "line-clamp-5"
            }`}
          >
            {person.biography}
          </p>
          <button
            onClick={toggleBio}
            className="text-yellow-500 hover:underline mt-1"
          >
            {expanded ? "Show less" : "More info"}
          </button>
        </>
      )}
    </div>
  );
}
