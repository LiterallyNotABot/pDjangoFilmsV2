import { useEffect, useState } from "react";
import useUserStore from "../store/user/userStore";
import HeroSection from "../components/layout/HeroSection";
import LatestPosters from "../components/home/LatestPosters";
import ReviewFeed from "../features/reviews/ReviewFeed";
import ListFeed from "../features/users/ListFeed";
import {
  getLatestFilms,
  getFriendsActivityFilms,
} from "../services/films/films"; // 👈 nuevo import

export default function Home() {
  const { user } = useUserStore();

  const [films, setFilms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filmsData = user
          ? await getFriendsActivityFilms(12)
          : await getLatestFilms(12);
        setFilms(filmsData);

        // TODO: añadir lógica para reviews y lists más adelante
      } catch (error) {
        console.error("Error fetching films:", error);
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
