import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ListCard from "@/features/users/ListCard";
import ListForm from "./ListForm";
import ListDetails from "./ListDetails";
import useUserStore from "@/store/user/userStore";
import useListStore from "@/store/user/listStore";
import { fetchUserLists } from "@/services/users/lists";

export default function ListsTab() {
  const { username } = useParams();
  const navigate = useNavigate();
  const currentUser = useUserStore((state) => state.user);
  const isOwner = currentUser?.username === username;

  const { lists, loading, error, setLists, addList } = useListStore();

  useEffect(() => {
    async function loadLists() {
      try {
        const data = await fetchUserLists(username);
        const adapted = (data?.results ?? []).map((list) => ({
          ...list,
          films: list.film_details ?? [],
        }));
        setLists(adapted);
      } catch {
        setLists([]);
      }
    }

    loadLists();
  }, [username, setLists]);

  const handleCreateList = (newList) => {
    const newId = Date.now();
    addList({ ...newList, id: newId, user: username });
    navigate(`/user/${username}/lists/${newId}`);
  };

  const handleFilmLike = () => {};
  const handleFilmWatched = () => {};
  const handleListLike = () => {};

  if (loading)
    return (
      <div className="text-center py-10 text-zinc-400">
        Loading lists...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        {error}
      </div>
    );

  return (
    <Routes>
      <Route
        index
        element={
          <div className="space-y-10 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-wide text-green-400">
                Your Lists
              </h2>
              {isOwner && (
                <button
                  onClick={() => navigate("new")}
                  className="text-sm font-medium text-green-400 hover:text-lime-300 transition"
                >
                  + Create New List
                </button>
              )}
            </div>

            <hr className="border-zinc-700" />

            {(!lists || lists.length === 0) ? (
              <div className="py-20 text-center text-zinc-500 italic">
                {isOwner
                  ? "You have no lists yet. Start by creating one!"
                  : "This user has no lists yet."}
              </div>
            ) : (
              <div className="space-y-6">
                {lists.map((list) => (
                  <div
                    key={list.id}
                    onClick={() => navigate(`${list.id}`)}
                    className="transition hover:opacity-90 hover:scale-[1.01] cursor-pointer"
                  >
                    <ListCard
                      list={list}
                      activityMap={{}}
                      onToggleLiked={handleFilmLike}
                      onToggleWatched={handleFilmWatched}
                      onToggleListLiked={handleListLike}
                      showLikeButton={!isOwner}
                    />
                  </div>
                ))}
              </div>
            )}

            <hr className="border-zinc-700" />
          </div>
        }
      />
      <Route path="new" element={<ListForm onSubmit={handleCreateList} />} />
      <Route path=":id" element={<ListDetails />} />
    </Routes>
  );
}
