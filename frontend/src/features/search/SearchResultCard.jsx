import PropTypes from "prop-types";
import { memo } from "react";
import { Link } from "react-router-dom";

import FilmCard from "@/features/films/FilmCard";
import PersonCard from "@/features/films/persons/PersonCard";
import ListCard from "@/features/users/ListCard";

function SearchResultCard({ type, data }) {
  let content = null;
  let linkTarget = "/";

  switch (type) {
    case "film":
      linkTarget = `/films/${data.id}`;
      content = (
        <div className="flex gap-4 items-start">
          <FilmCard
            id={data.id}
            title={data.title}
            year={data.release_year}
            posterUrl={data.poster_url}
            size="sm"
            showUserActions={false}
          />
          <div className="text-white text-sm">
            <h3 className="font-semibold text-base">{data.title}</h3>
            <p className="text-zinc-400">{data.release_year}</p>
            <p className="text-gray-300 line-clamp-2">{data.synopsis}</p>
          </div>
        </div>
      );
      break;

    case "person":
      linkTarget = `/person/${data.id}`;
      content = (
        <div className="flex gap-4 items-start">
          <PersonCard person={data} size="sm" />
          <div className="text-white text-sm flex-1">
            <h3 className="font-semibold text-base">{data.name}</h3>
            {data.alias && <p className="text-zinc-400">Alias: {data.alias}</p>}
            <p className="text-gray-300 line-clamp-2">{data.biography}</p>
          </div>
        </div>
      );
      break;

    case "list":
      linkTarget = `/list/${data.id}`;
      content = (
        <div className="flex gap-4 items-start">
          <ListCard data={data} />
          <div className="text-white text-sm">
            <h3 className="font-semibold text-base">{data.list_name}</h3>
            <p className="text-zinc-400">por @{data.username}</p>
            <p className="text-gray-300 line-clamp-2">
              {data.list_description}
            </p>
          </div>
        </div>
      );
      break;

    case "user":
      linkTarget = `/user/${data.username}`;
      content = (
        <div className="flex gap-4 items-center text-white">
          <div className="w-12 h-12 rounded-full bg-zinc-600 flex items-center justify-center text-xl">
            {data.username?.[0] ?? "U"}
          </div>
          <div className="flex-1 text-sm">
            <h3 className="font-semibold">@{data.username}</h3>
            {data.given_name && (
              <p className="text-zinc-400">{data.given_name}</p>
            )}
            <p className="text-gray-300">{data.bio}</p>
          </div>
        </div>
      );
      break;

    default:
      content = <p className="text-white">Tipo desconocido: {type}</p>;
  }

  return (
    <Link
      to={linkTarget}
      className="block border-b border-zinc-800 hover:bg-zinc-900 px-2 py-4 rounded transition"
    >
      {content}
    </Link>
  );
}

SearchResultCard.propTypes = {
  type: PropTypes.oneOf(["films", "person", "user", "list"]).isRequired,
  data: PropTypes.object.isRequired,
};

export default memo(SearchResultCard);
