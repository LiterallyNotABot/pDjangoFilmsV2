import StarIcon from "@/components/ui/icons/StarIcon";

const segments = [
  { value: 0.5, count: 8 },
  { value: 1.0, count: 12 },
  { value: 1.5, count: 25 },
  { value: 2.0, count: 40 },
  { value: 2.5, count: 65 },
  { value: 3.0, count: 90 },
  { value: 3.5, count: 110 },
  { value: 4.0, count: 130 },
  { value: 4.5, count: 100 },
  { value: 5.0, count: 70 },
];

export default function FilmRatingStats({ filmId }) {
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  const average = 4.2;
  const maxCount = Math.max(...segments.map(s => s.count));

  return (
    <div className="w-full mt-4 text-gray-300">
      {/* Header */}
      <div className="flex justify-between items-center px-[2px] mb-2 pb-1">
        <span className="text-xs uppercase text-gray-400 tracking-widest">Ratings</span>
        <span className="text-xs text-gray-400">{total.toLocaleString()} fans</span>
      </div>

      {/* Horizontal Row: Left Star + Chart + 5 Stars */}
      <div className="flex items-end gap-2">
        {/* Left star */}
        <StarIcon filled size="xs" className="text-green-500 mb-[2px]" />

        {/* Bar chart */}
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

        {/* Right stars */}
        <div className="flex gap-[2px] items-end mb-[2px] text-green-500">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled size="xs" />
          ))}
        </div>
      </div>
    </div>
  );
}
