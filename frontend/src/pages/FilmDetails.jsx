import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
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
import useFilmUserActivity from "@/hooks/useFilmUserActivity";
import useUserStore from "@/store/user/userStore";

export default function FilmDetails() {
  const { id } = useParams();
  const location = useLocation();
  const initialBackdrop = location.state?.backdropUrl || null;

  const [film, setFilm] = useState(null);
  const [backdrop, setBackdrop] = useState(initialBackdrop);
  const [friendActivity, setFriendActivity] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { user } = useUserStore();

  // Fetch film data
  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const data = await getFilmById(id);
        setFilm(data);
        setBackdrop(data.backdrop_url);
      } catch (error) {
        console.error("Error loading film:", error);
      }
    };

    fetchFilm();
  }, [id]);

  // Fake friend activity (placeholder logic)
  useEffect(() => {
    if (!film) return;

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
  }, [film]);

  useEffect(() => {
    document.body.style.overflow = showLoginModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLoginModal]);

  const {
    liked,
    watched,
    rating,
    watchlisted,
    updateField,
    toggleWatchlist,
    refetch,
  } = useFilmUserActivity(Number(id));

  if (!film) {
    return <p className="text-center text-green-500">Loading...</p>;
  }

  return (
    <>
      <Backdrop imageUrl={backdrop} size="medium" />

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8 md:space-y-0 md:grid md:grid-cols-[1fr_3fr_1fr] md:gap-10">
        {/* Poster */}
        <div className="md:sticky md:top-24 md:self-start order-1 md:order-none">
          <FilmCard
            id={film.film_id}
            title={film.title}
            year={film.release_year}
            posterUrl={film.poster_url}
            backdropUrl={film.backdrop_url}
            size="xl"
            showUserActions
            showUserTag={false}
            user={user} // ✅ Para que se muestre la barra de actividad
            activity={{ liked, watched }}
            onToggleLiked={() => updateField("liked", !liked)}
            onToggleWatched={() => updateField("watched", !watched)}
          />
        </div>

        {/* Main content */}
        <div className="space-y-6 order-3 md:order-none">
          <FilmHeader film={film} />
          <FilmTabs film={film} />
          {friendActivity.length > 0 && (
            <FriendActivityBar
              filmId={film.film_id}
              friendsData={friendActivity}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="md:sticky md:top-24 md:self-start order-2 md:order-none space-y-6">
          <FilmUserActions
            filmId={film.film_id}
            filmData={{
              id: film.film_id,
              title: film.title,
              year: film.release_year,
              posterUrl: film.poster_url,
            }}
            onTriggerLogin={() => setShowLoginModal(true)}
            liked={liked}
            watched={watched}
            rating={rating}
            watchlisted={watchlisted}
            updateField={updateField}
            toggleWatchlist={toggleWatchlist}
            refetchActivity={refetch}
          />

          <FilmRatingStats filmId={film.film_id} />
        </div>
      </div>

      {/* Login modal */}
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginForm onSuccess={() => setShowLoginModal(false)} />
      </Modal>
    </>
  );
}
