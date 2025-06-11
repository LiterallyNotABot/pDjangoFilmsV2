import { useEffect, useState } from "react";
import StarIcon from "@/components/ui/icons/StarIcon";
import { getRatingStats } from "@/services/reviews/ratings";

export default function FilmRatingStats({ filmId }) {
  const [segments, setSegments] = useState([]);
  const [average, setAverage] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!filmId) return;

    getRatingStats(filmId)
      .then(({ segments, average, total }) => {
        setSegments(segments);
        setAverage(average);
        setTotal(total);
      })
      .catch((err) => {
        console.error("Failed to load rating stats", err);
      });
  }, [filmId]);

  const maxCount = Math.max(...segments.map((s) => s.count), 1);

  return (
    <div className="w-full mt-4 text-gray-300">
      <div className="flex justify-between items-center px-[2px] mb-2 pb-1">
        <span className="text-xs uppercase text-gray-400 tracking-widest">Ratings</span>
        <span className="text-xs text-gray-400">{total.toLocaleString()} fans</span>
      </div>

      <div className="flex items-end gap-2">
        <StarIcon filled size="xs" className="text-green-500 mb-[2px]" />

        <div className="flex items-end gap-[2px] h-20 flex-1">
          {segments.map((segment, idx) => {
            const heightPercent = segment.count / maxCount;
            const percent = ((segment.count / total) * 100).toFixed(1);
            return (
              <div
                key={idx}
                title={`${segment.value}★ — ${segment.count} ratings (${percent}%)`}
                className="flex-1 bg-zinc-700 hover:bg-yellow-400 rounded-sm transition-all duration-200"
                style={{ height: `${heightPercent * 100}%` }}
              />
            );
          })}
        </div>

        <div className="flex gap-[2px] items-end mb-[2px] text-green-500">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled size="xs" />
          ))}
        </div>
      </div>
    </div>
  );
}
