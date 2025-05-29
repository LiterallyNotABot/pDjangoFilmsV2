import { useState } from "react";
import useUserStore from "../../store/user/userStore";
import EyeIcon from "@/components/ui/icons/EyeIcon";
import HeartIcon from "@/components/ui/icons/HeartIcon";
import PlusIcon from "@/components/ui/icons/PlusIcon";
import PencilIcon from "@/components/ui/icons/PencilIcon";
import ListIcon from "@/components/ui/icons/ListIcon";
import StarIcon from "@/components/ui/icons/StarIcon";
import { Button } from "@/components/ui/Button";

export default function FilmUserActions({ filmId, onTriggerLogin }) {
  const { user } = useUserStore();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  const [watched, setWatched] = useState(false);
  const [liked, setLiked] = useState(false);
  const [watchlisted, setWatchlisted] = useState(false);

  if (!user) {
    return (
      <div className="bg-zinc-800 p-4 rounded text-center text-white">
        <p className="text-sm mb-2">Log in to track this film</p>
        <Button onClick={onTriggerLogin} variant="primary">
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden text-sm text-white shadow">
      {/* Top row of icon buttons */}
      <div className="flex justify-around border-b border-zinc-700 p-4">
        <div className="flex flex-col items-center text-zinc-300 group">
          <EyeIcon
            size="xl"
            active={watched}
            onClick={() => setWatched((prev) => !prev)}
          />
          <span className="text-xs mt-1 text-zinc-300">Watch</span>
        </div>

        <div className="flex flex-col items-center text-zinc-300 group">
          <HeartIcon
            size="xl"
            active={liked}
            onClick={() => setLiked((prev) => !prev)}
          />
          <span className="text-xs mt-1 text-zinc-300">Like</span>
        </div>

        <div className="flex flex-col items-center text-zinc-300 group">
          <PlusIcon
            size="xl"
            active={watchlisted}
            onClick={() => setWatchlisted((prev) => !prev)}
          />
          <span className="text-xs mt-1 text-zinc-300">Watchlist</span>
        </div>
      </div>

      {/* Star rating with 0.5 steps */}
      <div className="text-center border-b border-zinc-700 p-5">
        <p className="mb-2 text-gray-400 text-base">Rate</p>
        <div className="flex justify-center gap-[2px]">
          {[1, 2, 3, 4, 5].map((value) => {
            const current = hover ?? rating;
            return (
              <button
                key={value}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHover(value - 0.5)}
                onMouseMove={(e) => {
                  const { left, width } =
                    e.currentTarget.getBoundingClientRect();
                  const isLeft = e.clientX - left < width / 2;
                  setHover(isLeft ? value - 0.5 : value);
                }}
                onMouseLeave={() => setHover(null)}
                className="cursor-pointer"
              >
                <StarIcon
                  filled={value <= current}
                  half={value - 0.5 === current}
                  size="xl"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional actions */}
      <div className="divide-y divide-zinc-700">
        <ActionItem icon={<PencilIcon size="lg" />} text="Review or log..." />
        <ActionItem icon={<ListIcon size="lg" />} text="Add to lists..." />
      </div>
    </div>
  );
}

function ActionItem({ icon, text }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-4 hover:bg-zinc-800 group transition text-left">
      {icon}
      <span className="text-[15px] text-zinc-300 group-hover:text-green-400 transition">
        {text}
      </span>
    </button>
  );
}
