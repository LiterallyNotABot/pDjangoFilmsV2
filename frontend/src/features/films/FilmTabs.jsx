import { useState } from "react";
import CastTab from "./tabs/CastTab";
import CrewTab from "./tabs/CrewTab";
import DetailsTab from "./tabs/DetailsTab";
import GenresTab from "./tabs/GenresTab";

export default function FilmTabs({ film }) {
  if (!film) return null;

  const [activeTab, setActiveTab] = useState("cast");

  const tabClass = (tab) =>
    `uppercase text-sm font-semibold cursor-pointer ${
      activeTab === tab
        ? "text-green-500 border-b-2 border-green-500"
        : "text-gray-400"
    }`;

  return (
    <div className="space-y-4">
      <div className="flex space-x-6 border-b border-zinc-700 pb-2">
        {["cast", "crew", "details", "genres"].map((tab) => (
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
        {activeTab === "cast" && <CastTab film={film} />}
        {activeTab === "crew" && <CrewTab film={film} />}
        {activeTab === "details" && <DetailsTab film={film} />}
        {activeTab === "genres" && <GenresTab film={film} />}
      </div>
    </div>
  );
}
