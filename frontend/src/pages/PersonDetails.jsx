// src/pages/PersonDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getPersonById, getPersonRoles } from "../services/films/persons";
import PersonsInfo from "../features/films/persons/PersonsInfo";
import FilmGrid from "../features/films/FilmGrid";

export default function PersonDetails() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [person, setPerson] = useState(null);
  const [roles, setRoles] = useState([]);

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

  if (!person) {
    return <p className="text-center text-green-500">Loading...</p>;
  }

  const genreFilter = {
    key: "genre",
    options: [
      { label: "All Genres", value: "" },
      { label: "Action", value: "Action" },
      { label: "Drama", value: "Drama" },
      { label: "Comedy", value: "Comedy" },
      { label: "Horror", value: "Horror" },
      // …otros géneros
    ],
  };

  const sortOptions = [
    { label: "Popularity", value: "popularity" },
    { label: "Newest First", value: "-year" },
    { label: "Earliest First", value: "year" },
    { label: "Highest Rated", value: "-user_rating" },
    { label: "Lowest Rated", value: "user_rating" },
    { label: "Shortest", value: "length" },
    { label: "Longest", value: "-length" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      {/* Título y separator */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">{person.name}</h1>
      </div>

      {/* Layout principal */}
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-[2fr_1fr] lg:gap-10 lg:space-y-0 space-y-8">
        {/* Film grid y filtros */}
        <div className="space-y-4">
          <FilmGrid
            personId={id}
            cardSize="md"
            showRoleDropdown
            roles={roles}
            filters={[genreFilter]}
            sortOptions={sortOptions}
          />
        </div>

        {/* Sidebar bio */}
        <aside className="space-y-4">
          <PersonsInfo person={person} />
        </aside>
      </div>
    </div>
  );
}
