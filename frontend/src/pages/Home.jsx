import useUserStore from "../store/userStore";
import HeroSection from "../components/home/HeroSection";
import LatestPosters from "../components/home/LatestPosters";
import FriendsActivity from "../components/home/FriendsActivity";
import ReviewFeed from "../features/reviews/ReviewFeed";
import ListFeed from "../features/users/ListFeed";

import poster from "../assets/poster.jpg";

export default function Home() {
  const { user } = useUserStore();

  // MOCKS para pruebas
  const mockFilms = [...Array(10)].map((_, i) => ({
    id: i,
    title: `Film ${i + 1}`,
    year: 2000 + i,
    posterUrl: poster,
  }));

  const mockActivity = [
    {
      id: 1,
      friend: "cinebro",
      film: {
        id: 101,
        title: "Blade Runner 2049",
        year: 2017,
        posterUrl: poster,
      },
      watched: true,
      liked: true,
      rating: 4.5,
      reviewed: true,
    },
  ];

const mockReviews = [
  {
    filmTitle: "Possession",
    posterUrl: poster,
    author: "cinebro",
    date: "hace 2 días",
    rating: 5,
    text: "Una actuación explosiva. Esto no es solo una película, es un colapso nervioso con arte.",
    likes: 21,
    comments: 3,
  },
  {
    filmTitle: "The Lighthouse",
    posterUrl: poster,
    author: "kafka_maniac",
    date: "hace 1 semana",
    rating: 4,
    text: "Un descenso progresivo a la locura con estilo y mitología marinera. Brillante uso del blanco y negro.",
    likes: 52,
    comments: 5,
  },
  {
    filmTitle: "La Haine",
    posterUrl: poster,
    author: "zizou23",
    date: "ayer",
    rating: 4.5,
    text: "Cruda, poética, potente. Retrato impactante del odio en los suburbios franceses.",
    likes: 37,
    comments: 2,
  },
  {
    filmTitle: "In the Mood for Love",
    posterUrl: poster,
    author: "cineasia",
    date: "hace 4 días",
    rating: 5,
    text: "Una elegía visual del amor contenido. Wong Kar-wai filma la melancolía como nadie.",
    likes: 84,
    comments: 6,
  },
  {
    filmTitle: "Come and See",
    posterUrl: poster,
    author: "sovietbrutalism",
    date: "hace 3 días",
    rating: 5,
    text: "El horror absoluto de la guerra. No es entretenimiento: es un trauma cinematográfico.",
    likes: 120,
    comments: 8,
  },
  {
    filmTitle: "The Banshees of Inisherin",
    posterUrl: poster,
    author: "martins_microcosmos",
    date: "hace 2 semanas",
    rating: 3.5,
    text: "Divertida y desgarradora al mismo tiempo. Un cuento oscuro sobre amistad, orgullo y aislamiento.",
    likes: 28,
    comments: 1,
  },
  {
    filmTitle: "Whiplash",
    posterUrl: poster,
    author: "jazzjunkie",
    date: "hace 5 días",
    rating: 4.5,
    text: "¿Hasta dónde vale la pena llegar por la perfección? Tensión, música, sangre. No es una clase de música más.",
    likes: 65,
    comments: 4,
  }
];


  const mockLists = [
    {
      title: "Top favoritos de terror",
      user: "cinebro",
      likes: 11,
      updated: "ayer",
      comments: 2,
      films: [
        { title: "The Thing", posterUrl: poster },
        { title: "Hereditary", posterUrl: poster },
        { title: "Suspiria", posterUrl: poster },
        { title: "The Shining", posterUrl: poster },
        { title: "The Witch", posterUrl: poster },
      ],
    },
    {
      title: "Las mejores del siglo XXI",
      user: "sandra",
      likes: 30,
      updated: "hace 3 días",
      comments: 5,
      films: [
        { title: "Parasite", posterUrl: poster },
        { title: "There Will Be Blood", posterUrl: poster },
        { title: "The Social Network", posterUrl: poster },
        { title: "Moonlight", posterUrl: poster },
        { title: "Inside Llewyn Davis", posterUrl: poster },
      ],
    },
    {
      title: "Cine coreano imperdible",
      user: "jihoon94",
      likes: 47,
      updated: "hoy",
      comments: 3,
      films: [
        { title: "Oldboy", posterUrl: poster },
        { title: "Burning", posterUrl: poster },
        { title: "Mother", posterUrl: poster },
        { title: "Memories of Murder", posterUrl: poster },
        { title: "The Wailing", posterUrl: poster },
      ],
    },
    {
      title: "Sangre y venganza",
      user: "noirfan",
      likes: 24,
      updated: "hace 1 semana",
      comments: 1,
      films: [
        { title: "Kill Bill", posterUrl: poster },
        { title: "Blue Ruin", posterUrl: poster },
        { title: "John Wick", posterUrl: poster },
        { title: "Revenge", posterUrl: poster },
        { title: "Lady Snowblood", posterUrl: poster },
      ],
    },
    {
      title: "Dramas que te arruinan el día",
      user: "emopunk",
      likes: 18,
      updated: "hace 2 días",
      comments: 0,
      films: [
        { title: "Dancer in the Dark", posterUrl: poster },
        { title: "Grave of the Fireflies", posterUrl: poster },
        { title: "Requiem for a Dream", posterUrl: poster },
        { title: "Melancholia", posterUrl: poster },
        { title: "Breaking the Waves", posterUrl: poster },
      ],
    },
  ];

  return (
    <>
      {!user ? (
        <>
          <HeroSection
            backdropUrl="https://image.tmdb.org/t/p/original/oXGt9e7FIwojD99Cn1p764C83eO.jpg"
            onJoin={() => console.log("open register modal")}
          />
          <LatestPosters films={mockFilms} />
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10 max-w-6xl mx-auto px-4 py-12">
            <div className="space-y-6">            
              <ReviewFeed reviews={mockReviews} />
            </div>

            <div className="space-y-6 text-center">
              <ListFeed lists={mockLists} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="px-4 py-6">
            <h1 className="text-3xl font-bold text-white mb-6">
              Hola, {user.username} 👋
            </h1>
          </div>
          <FriendsActivity activities={mockActivity} />
          <ReviewFeed title="Friend Reviews" reviews={mockReviews} />
          <ListFeed title="Friend Lists" lists={mockLists} />
        </>
      )}
    </>
  );
}
