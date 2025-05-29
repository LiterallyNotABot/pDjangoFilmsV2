import PropTypes from "prop-types";
import HeartIcon from "../../components/ui/icons/HeartIcon";
import PencilIcon from "../../components/ui/icons/PencilIcon";
import StarIcon from "../../components/ui/icons/StarIcon";

export default function FilmActivityFooter({ rating, liked, reviewed }) {
  return (
    <div className="flex items-center justify-center gap-2 text-sm mt-1">
      {rating && (
        <span className="flex items-center gap-[1px] text-red-500 leading-none">
          {Array.from({ length: Math.floor(rating) }, (_, i) => (
            <StarIcon key={i} size="sm" filled />
          ))}
          {rating % 1 !== 0 && <span className="ml-[1px]">½</span>}
        </span>
      )}
      {liked && (
        <HeartIcon active size="sm" title="Liked" color="text-green-500" />
      )}
      {reviewed && <PencilIcon active size="sm" title="Reviewed" />}
    </div>
  );
}

FilmActivityFooter.propTypes = {
  rating: PropTypes.number,
  liked: PropTypes.bool,
  reviewed: PropTypes.bool,
};
