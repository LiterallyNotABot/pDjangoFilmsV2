import { useEffect, useState } from "react";
import useUserStore from "../store/user/userStore";
import useFilmActivityStore from "@/store/film/useFilmActivityStore";

import HeroSection from "../components/layout/HeroSection";
import LatestPosters from "../components/home/LatestPosters";
import ReviewFeed from "../features/reviews/ReviewFeed";
import ListFeed from "../features/users/ListFeed";

import { getLatestFilms } from "../services/films/films";
import { getFriendsActivityFilms } from "../services/activity/activity";
import {
  getPopularReviews,
  getFriendsReviews,
} from "../services/reviews/reviews";
import {
  getPopularLists,
  getFriendsLists,
} from "../services/users/lists";
import { getUserFilmActivityBatch } from "../services/users/users";

export default function Home() {
  const { user, loadUserFromStorage } = useUserStore();
  const { bulkSetActivity } = useFilmActivityStore();

  const [films, setFilms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [activityReady, setActivityReady] = useState(false);

  useEffect(() => {
    loadUserFromStorage();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setActivityReady(false);

      const isLoggedIn = !!user;

      try {
        const [filmsData, reviewsData, listsData] = await Promise.all([
          isLoggedIn
            ? getFriendsActivityFilms(12, signal)
            : getLatestFilms(12, signal),
          isLoggedIn
            ? getFriendsReviews(6, signal)
            : getPopularReviews(6, signal),
          isLoggedIn
            ? getFriendsLists(6, signal)
            : getPopularLists(6, signal),
        ]);

        setFilms(filmsData || []);
        setReviews(reviewsData || []);
        setLists(listsData || []);

        const filmIds = new Set();
        filmsData?.forEach((f) => f?.id && filmIds.add(f.id));
        reviewsData?.forEach((r) => r.film?.id && filmIds.add(r.film.id));
        listsData?.forEach((l) =>
          l.films?.forEach((f) => f?.id && filmIds.add(f.id))
        );

        if (isLoggedIn && filmIds.size > 0) {
          const activity = await getUserFilmActivityBatch([...filmIds], signal);
          bulkSetActivity(activity);
        }

        setActivityReady(true);
      } catch (error) {
        console.error("Error fetching home data:", error.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [hydrated, user]);

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-12">
        Loading homepage...
      </div>
    );
  }

  return (
    <>
      <HeroSection
        user={user}
        backdropUrl="https://image.tmdb.org/t/p/original/oXGt9e7FIwojD99Cn1p764C83eO.jpg"
        onJoin={() => console.log("open register modal")}
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
            activityReady={activityReady}
          />
        </div>

        <div className="space-y-6 text-center">
          <ListFeed
            title={user ? "Friends Lists" : "Popular Lists"}
            lists={lists}
            activityReady={activityReady}
          />
        </div>
      </div>
    </>
  );
}
