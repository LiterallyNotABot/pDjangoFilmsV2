import Tooltip from "@/components/ui/Tooltip";

export default function FilmPosterImage({ title, year, src, onClick, size, tooltip = true }) {
  const img = (
    <div className="poster-click-area" onClick={onClick}>
      <img
        loading="lazy"
        src={src}
        alt={title}
        className="film-poster-img"
      />
    </div>
  );

  return tooltip && (size === "sm" || size === "md") ? (
    <Tooltip content={`${title} (${year ?? ""})`}>{img}</Tooltip>
  ) : img;
}
