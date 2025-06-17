import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getListDetails } from "@/services/users/lists";
import FilmCard from "@/features/films/FilmCard";

export default function ListDetails() {
  const { username, id } = useParams(); // ← ahora también tomamos username
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadList() {
      try {
        const data = await getListDetails(username, id); // ← usamos username
        setList(data);
      } catch (err) {
        setError("Failed to load list.");
      } finally {
        setLoading(false);
      }
    }
    loadList();
  }, [username, id]);

  if (loading) {
    return <div className="text-center text-zinc-400 py-10">Loading list...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 py-10">{error}</div>;
  }

  if (!list) {
    return <div className="text-center text-red-400 py-10">List not found.</div>;
  }

  return (
    <div className="p-6 text-white space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{list.name}</h1>
          {list.description && <p className="text-zinc-400">{list.description}</p>}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Back
        </button>
      </div>

      {list.film_details?.length > 0 ? (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {list.film_details.map((film) => (
            <li key={film.id}>
              <FilmCard
                id={film.id}
                title={film.title}
                year={film.year}
                posterUrl={film.posterUrl}
                size="md"
                showUserActions={false}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-zinc-500 py-8">
          This list has no films yet.
        </div>
      )}
    </div>
  );
}
