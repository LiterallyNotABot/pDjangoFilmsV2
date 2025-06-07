import { useEffect, useState } from "react";
import useUserStore from "../store/user/userStore";
import HeroSection from "../components/layout/HeroSection";
import LatestPosters from "../components/home/LatestPosters";
import ReviewFeed from "../features/reviews/ReviewFeed";
import ListFeed from "../features/users/ListFeed";
import axios from "axios";
import { getLatestFilms } from "../services/films/films";
import { getFriendsActivityFilms } from "../services/activity/activity";
import {
  getPopularReviews,
  getFriendsReviews,
} from "../services/reviews/reviews";
import { getPopularLists, getFriendsLists } from "../services/users/lists";
import { handleApiError } from "../services/exceptionHelper";

export default function Home() {
  const { user } = useUserStore();
  const [films, setFilms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      const isLoggedIn = !!user;

      try {
        const [filmsData, reviewsData, listsData] = await Promise.all([
          isLoggedIn
            ? getFriendsActivityFilms(12, signal)
            : getLatestFilms(12, signal),
          isLoggedIn
            ? getFriendsReviews(6, signal)
            : getPopularReviews(6, signal),
          isLoggedIn ? getFriendsLists(6, signal) : getPopularLists(6, signal),
        ]);

        setFilms(filmsData || []);
        setReviews(reviewsData || []);
        setLists(listsData || []);
      } catch (error) {
        if (error) {
          console.error("Error fetching home data:", error.message || error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort(); // Cancela si el componente se desmonta
  }, [user?.id]);

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-12">Loading homepage...</div>
    );
  }

  return (
    <>
      <HeroSection
        user={user}
        backdropUrl="https://image.tmdb.org/t/p/original/oXGt9e7FIwojD99Cn1p764C83eO.jpg"
        onJoin={() => console.info("open register modal")}
      />

      <LatestPosters
        title={user ? "Friends Activity" : "Last Releases"}
        films={films}
        isFriendsActivity={!!user}
      />

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10 max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-6">
          <ReviewFeed
            title={user ? "Friends Reviews" : "Popular Reviews"}
            reviews={reviews}
          />
        </div>

        <div className="space-y-6 text-center">
          <ListFeed
            title={user ? "Friends Lists" : "Popular Lists"}
            lists={lists}
          />
        </div>
      </div>
    </>
  );
}
