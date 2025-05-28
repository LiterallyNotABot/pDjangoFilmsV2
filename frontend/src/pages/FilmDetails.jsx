import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Backdrop from "../components/layout/Backdrop";
import { getFilmById } from "../services/films/films";
import FilmCard from "../features/films/FilmCard";
import FilmHeader from "../features/films/FilmHeader";
import FilmFacts from "../features/films/FilmFacts";
import FilmUserActions from "../features/films/FilmUserActions";
import FilmRatingStats from "../features/films/FilmRatingStats";
import FilmTabs from "../features/films/FilmTabs";
export default function FilmDetails() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);

  useEffect(() => {
    getFilmById(id).then(setFilm).catch(console.error);
  }, [id]);

  if (!film) return <p className="text-center text-green-500">Loading...</p>;

  return (
    <>
      <Backdrop imageUrl={film.backdrop_url} size="medium" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-10 px-4 py-12">
        {/* Sticky FilmCard */}
        <div className="sticky top-24 self-start">
          <FilmCard
            id={film.film_id}
            title={film.title}
            year={film.release_year}
            posterUrl={film.poster_url}
            size="xl"
            showUserActions={false}
            showUserTag={false}
          />
        </div>

        <div className="space-y-6">
          <FilmHeader film={film} />
          <FilmTabs film={film} />
        </div>

        <div className="sticky top-24 self-start">
          <FilmUserActions filmId={film.film_id} />
          <FilmRatingStats filmId={film.film_id} />
        </div>
      </div>
    </>
  );
}
