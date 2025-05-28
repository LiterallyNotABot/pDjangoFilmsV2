import { useState } from "react";

export default function FilmTabs({ film }) {
  if (!film) return null; // ⛔ Asegura que no hay acceso prematuro

  const [activeTab, setActiveTab] = useState("cast");

  const tabClass = (tab) =>
    `uppercase text-sm font-semibold cursor-pointer ${
      activeTab === tab ? "text-green-500 border-b-2 border-green-500" : "text-gray-400"
    }`;

  const cast = film.crew?.filter((m) => m.role.name.toLowerCase() === "actor") || [];
  const crew = film.crew?.filter((m) => m.role.name.toLowerCase() !== "actor") || [];

  return (
    <div className="space-y-4">
      <div className="flex space-x-6 border-b border-zinc-700 pb-2">
        {["cast", "crew", "details", "genres", "releases"].map((tab) => (
          <div
            key={tab}
            className={tabClass(tab)}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </div>
        ))}
      </div>

      <div className="mt-2">
        {activeTab === "cast" && (
          <div className="flex flex-wrap gap-2">
            {cast.map((member, i) => (
              <span key={i} className="bg-zinc-800 px-3 py-1 rounded text-sm text-white">
                {member.person.name}
              </span>
            ))}
          </div>
        )}

        {activeTab === "crew" && (
          <div className="space-y-2">
            {crew.map((member, i) => (
              <div key={i} className="text-sm text-gray-300">
                <strong className="text-white">{member.person.name}</strong>{" "}
                <span className="text-zinc-400">({member.role.name})</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "details" && (
          <div className="text-sm text-gray-300 space-y-1">
            <div><strong>Status:</strong> {film.status}</div>
            <div><strong>Runtime:</strong> {film.runtime} mins</div>
            <div><strong>Budget:</strong> ${film.budget?.toLocaleString()}</div>
            <div><strong>Revenue:</strong> ${film.revenue?.toLocaleString()}</div>
            <div><strong>Languages:</strong> {film.languages?.map(l => l.language_name).join(", ")}</div>
            <div><strong>Countries:</strong> {film.countries?.map(c => c.country_name).join(", ")}</div>
          </div>
        )}

        {activeTab === "genres" && (
          <div className="flex flex-wrap gap-2">
            {film.genres?.map((g, i) => (
              <span key={i} className="bg-green-900 text-green-300 px-3 py-1 rounded text-sm">
                {g.genre_name}
              </span>
            ))}
          </div>
        )}

        {activeTab === "releases" && (
          <p className="text-zinc-400 text-sm">Coming soon...</p>
        )}
      </div>
    </div>
  );
}
