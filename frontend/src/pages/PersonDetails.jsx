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

  // Fetch person and roles in parallel
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

  // Ensure role param exists
  useEffect(() => {
    if (!searchParams.get("role")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("role", "Actor");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  if (!person) {
    return <p className="text-center text-green-500">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      {/* Centered title */}
      <div className="flex justify-center">
        <div className="w-full max-w-[960px]">
          <h1 className="text-3xl font-bold text-white text-center">
            {person.name}
          </h1>
        </div>
      </div>

      {/* Bio first on mobile, grid first on desktop */}
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-[2fr_1fr] lg:gap-10 lg:space-y-0 space-y-8">
        {/* Film grid and toolbar */}
        <div className="space-y-4">
          <PersonToolbar roles={roles} />
          <FilmGrid personId={id} cardSize="md" />
        </div>

        {/* Sidebar bio */}
        <aside>
          <PersonsInfo person={person} />
        </aside>
      </div>
    </div>
  );
}
