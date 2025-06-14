import PropTypes from "prop-types";
import ListCard from "./ListCard";
import "./css/ListFeed.css";
import { useMemo, useState } from "react";
import { toggleListLike } from "@/services/users/lists";
import useUserStore from "@/store/user/userStore";
import useUserFilmToggle from "@/hooks/useUserFilmToggle";
import useFilmActivityStore from "@/store/film/useFilmActivityStore";

export default function ListFeed({ title = "Popular Lists", lists }) {
  const { user } = useUserStore();
  const { activityByFilmId, setActivity } = useFilmActivityStore();

  const [localLists, setLocalLists] = useState(lists);

  const handleToggle = useUserFilmToggle(activityByFilmId, setActivity);

  const handleToggleListLiked = async (listId) => {
    if (!user) return;

    try {
      const res = await toggleListLike(listId);
      setLocalLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? {
                ...list,
                likedByUser: res.liked,
                likes: list.likes + (res.liked ? 1 : -1),
              }
            : list
        )
      );
    } catch (err) {
      console.error("Failed to toggle like on list", err);
    }
  };

  return (
    <section className="list-feed-section">
      <h2 className="list-feed-title">{title}</h2>
      <div className="list-feed-list">
        {localLists.map((list, i) => (
          <div key={list.id || i}>
            <ListCard
              list={list}
              activityMap={activityByFilmId}
              onToggleLiked={(id) => handleToggle(id, "liked")}
              onToggleWatched={(id) => handleToggle(id, "watched")}
              onToggleListLiked={handleToggleListLiked}
            />
            {i < localLists.length - 1 && <hr className="list-divider" />}
          </div>
        ))}
      </div>
    </section>
  );
}

ListFeed.propTypes = {
  title: PropTypes.string,
  lists: PropTypes.array.isRequired,
};
