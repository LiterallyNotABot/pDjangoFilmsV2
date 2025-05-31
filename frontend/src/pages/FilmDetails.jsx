import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Backdrop from "../components/layout/Backdrop";
import { getFilmById } from "../services/films/films";
import FilmCard from "../features/films/FilmCard";
import FilmHeader from "../features/films/FilmHeader";
import FilmUserActions from "../features/films/FilmUserActions";
import FilmRatingStats from "../features/films/FilmRatingStats";
import FilmTabs from "../features/films/FilmTabs";
import FriendActivityBar from "../features/users/FriendActivityBar";
import Modal from "@/components/ui/Modal";
import LoginForm from "@/components/forms/LoginForm";

export default function FilmDetails() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [friendActivity, setFriendActivity] = useState([]);

  useEffect(() => {
    getFilmById(id).then(setFilm).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (film) {
      setFriendActivity([
        {
          username: "hannahwebb",
          avatar: "/assets/profpic_placeholder.png",
          watched: true,
          watchlist: false,
          rating: 4.5,
        },
        {
          username: "juanito",
          avatar: "/assets/profpic_placeholder.png",
          watched: false,
          watchlist: true,
          rating: 0,
        },
      ]);
    }
  }, [film]);

  if (!film) return <p className="text-center text-green-500">Loading...</p>;

  return (
    <>
      <Backdrop imageUrl={film.backdrop_url} size="medium" />

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8 md:space-y-0 md:grid md:grid-cols-[1fr_3fr_1fr] md:gap-10">
        {/* Poster */}
        <div className="md:sticky md:top-24 md:self-start order-1 md:order-none">
          <FilmCard
            id={film.film_id}
            title={film.title}
            year={film.release_year}
            posterUrl={film.poster_url}
            size="xl"
            showUserActions={true}
            showUserTag={false}
          />
        </div>

        {/* Main Content */}
        <div className="space-y-6 order-3 md:order-none">
          <FilmHeader film={film} />
          <FilmTabs film={film} />
          {friendActivity.length > 0 && (
            <FriendActivityBar filmId={film.film_id} friendsData={friendActivity} />
          )}
        </div>

        {/* User Interactions + Stats */}
        <div className="md:sticky md:top-24 md:self-start order-2 md:order-none space-y-6">
          <FilmUserActions
            filmId={film.film_id}
            onTriggerLogin={() => setShowLoginModal(true)}
          />
          <FilmRatingStats filmId={film.film_id} />
        </div>
      </div>

      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginForm onSuccess={() => setShowLoginModal(false)} />
      </Modal>
    </>
  );
}