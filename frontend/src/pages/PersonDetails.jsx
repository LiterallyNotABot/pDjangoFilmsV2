import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPersonById, getPersonRoles } from "../services/films/persons";
import PersonsInfo from "../features/films/persons/PersonsInfo";
import RoleFilterDropdown from "../features/films/persons/RoleFilterDropdown";
import FilmGrid from "../features/films/FilmGrid";
import PersonToolbar from "../features/films/persons/PersonToolbar";

export default function PersonDetails() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    getPersonById(id).then(setPerson);
    getPersonRoles(id).then(setRoles);
  }, [id]);

  if (!person) return <p className="text-center text-green-500">Loading...</p>;

  return (
    <div className="p-4 space-y-6">
      <PersonsInfo person={person} />
      <PersonToolbar roles={roles} />
      <FilmGrid />
    </div>
  );
}
