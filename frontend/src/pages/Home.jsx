import useUserStore from "../store/userStore";
import HeroSection from "../components/home/HeroSection";
import LatestPosters from "../components/home/LatestPosters";
import PopularReviews from "../components/home/PopularReviews";
import PopularLists from "../components/home/PopularLists";
import FriendsActivity from "../components/home/FriendsActivity";
import FriendsReviews from "../components/home/FriendsReviews";
import FriendsLists from "../components/home/FriendsLists";

import poster from "../assets/poster.jpg";
import backdrop from "../assets/backdrop.jpg";

export default function Home() {
  const { user } = useUserStore();

  // MOCKS para pruebas
  const mockFilms = [...Array(10)].map((_, i) => ({
    id: i,
    title: `Film ${i + 1}`,
    year: 2000 + i,
    posterUrl: poster
  }));

  const mockActivity = [
    {
      id: 1,
      friend: "cinebro",
      film: {
        id: 101,
        title: "Blade Runner 2049",
        year: 2017,
        posterUrl: poster
      },
      watched: true,
      liked: true,
      rating: 4.5,
      reviewed: true
    }
  ];

  const mockReviews = [
    {
      filmTitle: "Possession",
      posterUrl: poster,
      author: "cinebro",
      date: "hace 2 días",
      rating: 5,
      text: "Una actuación explosiva. Esto no es solo una película, es un colapso nervioso con arte.",
      likes: 21
    }
  ];

  const mockLists = [
    {
      title: "Top favoritos de terror",
      user: "cinebro",
      likes: 11,
      updated: "ayer",
      films: [
        { title: "The Thing", posterUrl: poster },
        { title: "Hereditary", posterUrl: poster },
        { title: "Suspiria", posterUrl: poster },
        { title: "The Shining", posterUrl: poster }
      ]
    }
  ];

  return (
    <>
      {!user ? (
        <>
          <HeroSection backdropUrl="https://image.tmdb.org/t/p/original/LmFsrbDbh3D4d3gGfBIwu3A99t.jpg" onJoin={() => console.log("open register modal")} />
          <LatestPosters films={mockFilms} />
          <PopularReviews reviews={mockReviews} />
          <PopularLists lists={mockLists} />
        </>
      ) : (
        <>
          <div className="px-4 py-6">
            <h1 className="text-3xl font-bold text-white mb-6">Hola, {user.username} 👋</h1>
          </div>
          <FriendsActivity activities={mockActivity} />
          <FriendsReviews reviews={mockReviews} />
          <FriendsLists lists={mockLists} />
        </>
      )}
    </>
  );
}
