import HorizontalGrid from "../ui/HorizontalGrid";
import FilmCard from "../../features/films/FilmCard";

export default function FriendsActivity({ activities = [] }) {
  return (
    <HorizontalGrid
      title="Actividad reciente de tus amigos"
      items={activities}
      renderItem={(activity) => (
        <FilmCard
          key={activity.id}
          id={activity.film.id}
          title={activity.film.title}
          year={activity.film.year}
          posterUrl={activity.film.posterUrl}
          size="md"
          user={{
            username: activity.friend,
            liked: activity.liked,
            watched: activity.watched,
            rating: activity.rating,
            reviewed: activity.reviewed
          }}
          showUserTag={true}
          showUserActions={true}
        />
      )}
    />
  );
}
