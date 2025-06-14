import EyeIcon from "@/components/ui/icons/EyeIcon";
import HeartIcon from "@/components/ui/icons/HeartIcon";
import PencilIcon from "@/components/ui/icons/PencilIcon";

export default function FilmUserActionsBar({
  watched = false,
  liked = false,
  onToggleWatched,
  onToggleLiked,
  onReview,
}) {
  return (
    <div className="film-card-icons opacity-0 group-hover:opacity-100 transition">
      <EyeIcon
        size="md"
        active={watched}
        className="hover:text-red-400"
        onClick={(e) => {
          e.stopPropagation();
          onToggleWatched?.();
        }}
      />
      <HeartIcon
        size="md"
        active={liked}
        className="hover:text-green-400"
        onClick={(e) => {
          e.stopPropagation();
          onToggleLiked?.();
        }}
      />
      <PencilIcon
        size="md"
        className="hover:text-red-300"
        onClick={(e) => {
          e.stopPropagation();
          onReview?.();
        }}
      />
    </div>
  );
}
