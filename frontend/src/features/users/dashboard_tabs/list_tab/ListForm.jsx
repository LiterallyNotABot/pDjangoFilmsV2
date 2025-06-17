import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";
import { searchFilms } from "@/services/films/films";
import FilmCard from "@/features/films/FilmCard";
import { createList, updateList, deleteList } from "@/services/users/lists";
import useUserStore from "@/store/user/userStore";

export default function ListForm({ defaultValues = {}, onSubmit }) {
  const navigate = useNavigate();
  const { username } = useParams();
  const currentUser = useUserStore((state) => state.user);

  const [name, setName] = useState(defaultValues.name || "");
  const [description, setDescription] = useState(defaultValues.description || "");
  const [films, setFilms] = useState(defaultValues.films || []);
  const [error, setError] = useState(null);

  const {
    query: filmInput,
    setQuery: setFilmInput,
    results: searchResults,
  } = useDebouncedSearch(searchFilms);

  const handleAddFilm = (film) => {
    if (films.find((f) => f.id === film.id)) return;
    setFilms([...films, film]);
    setFilmInput("");
  };

  const handleRemoveFilm = (id) => {
    setFilms(films.filter((film) => film.id !== id));
  };

  const handleSave = async () => {
    setError(null);
    try {
      const payload = {
        name,
        description,
        films: films.map((f) => f.id),
      };

      if (defaultValues.id) {
        await updateList(defaultValues.id, payload);
      } else {
        await createList(currentUser.username, payload);
      }

      if (onSubmit) onSubmit();
      window.location.href = `/user/${username}/lists`; // ✅ fuerza recarga
    } catch (err) {
      setError("An error occurred while saving the list.");
    }
  };

  const handleDelete = async () => {
    if (!defaultValues.id) return;
    try {
      await deleteList(defaultValues.id);
      if (onSubmit) onSubmit(null);
      window.location.href = `/user/${username}/lists`;
    } catch (err) {
      setError("Failed to delete the list.");
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(films);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setFilms(items);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white tracking-wide">
        {defaultValues.id ? "✏️ Edit List" : "➕ Create New List"}
      </h1>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-green-400">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="List title"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-green-400">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Short description"
          />
        </div>
      </div>

      <hr className="border-zinc-700 my-4" />

      <div className="space-y-2">
        <input
          value={filmInput}
          onChange={(e) => setFilmInput(e.target.value)}
          placeholder="🔍 Search for a film..."
          className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        {searchResults.length > 0 && (
          <ul className="bg-zinc-800 rounded shadow divide-y divide-zinc-700 max-h-64 overflow-y-auto">
            {searchResults.map((film) => (
              <li
                key={film.id}
                className="flex items-center gap-3 p-2 cursor-pointer hover:bg-zinc-700 transition"
                onClick={() => handleAddFilm(film)}
              >
                {film.poster_url && (
                  <img
                    src={film.poster_url}
                    alt={film.title}
                    className="w-10 h-14 object-cover rounded bg-zinc-900"
                  />
                )}
                <div>
                  <div className="text-white font-medium">{film.title}</div>
                  {film.year && <div className="text-sm text-zinc-400">{film.year}</div>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <hr className="border-zinc-700 my-4" />

      <div>
        <h3 className="text-white font-semibold mb-2">🎞 Films in List</h3>
        {films.length === 0 ? (
          <div className="text-center text-zinc-500 border border-zinc-700 rounded py-6">
            No films added yet.
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="films">
              {(provided) => (
                <ul
                  className="space-y-2"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {films.map((film, index) => (
                    <Draggable key={film.id} draggableId={film.id.toString()} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex justify-between items-center px-3 py-2 border border-zinc-700 bg-zinc-800 rounded"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-[84px] h-[120px]">
                              <FilmCard
                                id={film.id}
                                title={film.title}
                                year={film.year}
                                posterUrl={film.posterUrl}
                                size="sm"
                                showUserActions={false}
                                showUserTag={false}
                              />
                            </div>
                            <div>
                              <div className="text-white font-medium">{film.title}</div>
                              {film.year && (
                                <div className="text-sm text-zinc-500">{film.year}</div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFilm(film.id)}
                            title="Remove"
                            className="text-red-400 hover:text-red-300"
                          >
                            🗑
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      <hr className="border-zinc-700 my-6" />

      <div className="flex justify-end gap-4">
        {defaultValues.id && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:underline text-sm"
            type="button"
          >
            Delete
          </button>
        )}
        <button
          className="text-zinc-400 hover:text-white text-sm"
          onClick={() => navigate(`/user/${username}/lists`)}
          type="button"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-4 rounded"
          type="button"
        >
          {defaultValues.id ? "Update List" : "Create List"}
        </button>
      </div>
    </div>
  );
}
