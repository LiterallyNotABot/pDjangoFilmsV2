// features/films/persons/PersonStats.jsx
import { useEffect, useState } from "react";
import axios from "../../../services/axios";

export default function PersonStats({ personId, totalFilms }) {
  const [seenCount, setSeenCount] = useState(0);

  useEffect(() => {
    axios
      .get(`/users/me/stats/person/${personId}/`)
      .then((res) => setSeenCount(res.data.seen))
      .catch(() => {});
  }, [personId]);

  const percent = totalFilms > 0 ? Math.round((seenCount / totalFilms) * 100) : 0;

  return (
    <div className="bg-zinc-900 rounded-lg p-4 text-sm text-white">
      <p className="mb-2">You've watched <strong>{seenCount}</strong> of <strong>{totalFilms}</strong></p>
      <div className="w-full bg-zinc-800 h-2 rounded overflow-hidden">
        <div className="h-full bg-green-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-1 text-xs text-gray-400">{percent}% complete</p>
    </div>
  );
}
