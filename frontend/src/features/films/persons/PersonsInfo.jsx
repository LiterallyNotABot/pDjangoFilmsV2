import { useState } from "react";

export default function PersonInfo({ person }) {
  const [expanded, setExpanded] = useState(false);
  const toggleBio = () => setExpanded(!expanded);

  return (
    <div className="flex flex-col items-center text-center mb-6 text-white">
      {/* Imagen rectangular, bordes suaves, hover con zoom */}
      <div className="w-48 h-64 mb-4 rounded-lg overflow-hidden border-2 border-transparent hover:border-yellow-500 transition-all duration-300 shadow-md transform hover:scale-105">
        <img
          src={person.picture_url}
          alt={person.name}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Biografía alineada a la izquierda */}
      {person.biography && (
        <div className="text-sm text-gray-300 max-w-md text-left">
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
        </div>
      )}
    </div>
  );
}
