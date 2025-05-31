import { useEffect, useState } from "react";
import useUserStore from "../store/user/userStore";
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

import { getPopularLists, getFriendsLists } from "../services/users/lists";

export default function Home() {
  const { user } = useUserStore();

  const [films, setFilms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Films
        const filmsData = user
          ? await getFriendsActivityFilms(12)
          : await getLatestFilms(12);
        setFilms(filmsData);

        // Reviews
        const reviewsData = user
          ? await getFriendsReviews(6)
          : await getPopularReviews(6);
        setReviews(reviewsData);

        // Lists
        const listsData = user
          ? await getFriendsLists(6)
          : await getPopularLists(6);
        setLists(listsData);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };

    fetchData();
  }, [user]);

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
