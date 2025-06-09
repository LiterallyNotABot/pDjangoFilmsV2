import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  getPersonById,
  getPersonRoles,
  getAvailableGenresByPerson,
} from "../services/films/persons";
import PersonsInfo from "../features/films/persons/PersonsInfo";
import FilmGrid from "../features/films/FilmGrid";
import PersonCard from "../features/films/persons/PersonCard";

export default function PersonDetails() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [person, setPerson] = useState(null);
  const [roles, setRoles] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);

  const role = searchParams.get("role") || "Actor";

  useEffect(() => {
    Promise.all([getPersonById(id), getPersonRoles(id)])
      .then(([personData, rolesData]) => {
        setPerson(personData);
        setRoles(rolesData);
      })
      .catch((err) => {
        console.error("Failed to load person data", err);
      });
  }, [id]);

  useEffect(() => {
    if (!searchParams.get("role")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("role", "Actor");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!id || !role) return;

    const controller = new AbortController();

    getAvailableGenresByPerson(id, role, controller.signal)
      .then((genres) => {
        if (!Array.isArray(genres)) return;

        const formatted = [
          { label: "All Genres", value: "" },
          ...genres.map((g) => ({
            label: g.name,
            value: String(g.id),
          })),
        ];
        setGenreOptions(formatted);
      })
      .catch(() => {
        setGenreOptions([{ label: "All Genres", value: "" }]);
      });

    return () => controller.abort();
  }, [id, role]);

  if (!person) {
    return <p className="text-center text-green-500">Loading...</p>;
  }

  const filters = [
    {
      key: "genre",
      options: genreOptions,
    },
  ];

  const sortOptions = [
    { label: "Popularity", value: "popularity" },
    { label: "Newest First", value: "releaseDate_desc" },
    { label: "Oldest First", value: "releaseDate_asc" },
    { label: "Highest Rated", value: "userRating_desc" },
    { label: "Lowest Rated", value: "userRating_asc" },
    { label: "Shortest", value: "filmLength_asc" },
    { label: "Longest", value: "filmLength_desc" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">{person.name}</h1>
      </div>

      <div className="flex flex-col-reverse lg:grid lg:grid-cols-[2fr_1fr] lg:gap-10 lg:space-y-0 space-y-8">
        <div className="space-y-4">
          <FilmGrid
            personId={id}
            cardSize="md"
            showRoleDropdown
            roles={roles}
            filters={filters}
            sortOptions={sortOptions}
          />
        </div>

        <aside className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <PersonCard person={person} size="lg" />
            <PersonsInfo person={person} />
          </div>
        </aside>
      </div>
    </div>
  );
}
