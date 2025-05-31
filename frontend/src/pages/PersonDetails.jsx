import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getPersonById, getPersonRoles } from "../services/films/persons";
import PersonsInfo from "../features/films/persons/PersonsInfo";
import FilmGrid from "../features/films/FilmGrid";
import PersonToolbar from "../features/films/persons/PersonToolbar";

export default function PersonDetails() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [person, setPerson] = useState(null);
  const [roles, setRoles] = useState([]);

  // Solo establecer el rol si no existe
  useEffect(() => {
    if (!searchParams.get("role")) {
      searchParams.set("role", "Actor");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    getPersonById(id).then(setPerson);
    getPersonRoles(id).then(setRoles);
  }, [id]);

  if (!person) return <p className="text-center text-green-500">Loading...</p>;

  return (
    <div className="p-4 space-y-6">
      <PersonsInfo person={person} />
      <PersonToolbar roles={roles} />
      <FilmGrid personId={id} />
    </div>
  );
}
