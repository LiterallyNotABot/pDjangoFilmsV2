import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getPersonById, getPersonRoles } from "../services/films/persons";
import PersonsInfo from "../features/films/persons/PersonsInfo";
import PersonToolbar from "../features/films/persons/PersonToolbar";
import FilmGrid from "../features/films/FilmGrid";

export default function PersonDetails() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [person, setPerson] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    getPersonById(id).then(setPerson);
    getPersonRoles(id).then(setRoles);
  }, [id]);

  useEffect(() => {
    if (!searchParams.get("role")) {
      searchParams.set("role", "Actor");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  if (!person) return <p className="text-center text-green-500">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      {/* Nombre centrado respecto al grid (para cardSize md) */}
      <div className="flex justify-center">
        <div className="w-full max-w-[960px]">
          <h1 className="text-3xl font-bold text-white text-center">
            {person.name}
          </h1>
        </div>
      </div>

      {/* Layout: bio primero en mobile, grid primero en desktop */}
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-[2fr_1fr] lg:gap-10 lg:space-y-0 space-y-8">
        {/* Main content */}
        <div className="space-y-4">
          <PersonToolbar roles={roles} />
          <FilmGrid personId={id} cardSize="md" />
        </div>

        {/* Sidebar (bio) */}
        <aside>
          <PersonsInfo person={person} />
        </aside>
      </div>
    </div>
  );
}
