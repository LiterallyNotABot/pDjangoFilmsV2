import { useState } from "react";
import Badge from "../../../components/ui/Badge";

export default function CrewTab({ film }) {
  const [showAll, setShowAll] = useState(false);

  const crew = film.crew?.filter((m) => m.role.name.toLowerCase() !== "actor") || [];

  const grouped = crew.reduce((acc, member) => {
    const role = member.role.name;
    if (!acc[role]) acc[role] = [];
    acc[role].push(member.person);
    return acc;
  }, {});

  const priority = ["Director", "Producer", "Writer"];
  const rest = Object.keys(grouped).filter((r) => !priority.includes(r)).sort();
  const sortedRoles = [...priority, ...rest].filter((role) => grouped[role]);

  const visibleRoles = showAll ? sortedRoles : sortedRoles.slice(0, 10);

  return (
    <div className="text-sm text-gray-300 space-y-3">
      {visibleRoles.map((role) => (
        <div key={role} className="flex items-start">
          <div className="w-40 pr-4 text-white uppercase shrink-0">{role}</div>
          <div className="flex flex-wrap gap-2">
            {grouped[role].map((person, idx) => (
              <Badge key={idx} label={person.name} />
            ))}
          </div>
        </div>
      ))}

      {!showAll && sortedRoles.length > 10 && (
        <div className="flex items-start">
          <div className="w-40 pr-4 shrink-0" />
          <div className="flex">
            <Badge label="Show All..." onClick={() => setShowAll(true)} />
          </div>
        </div>
      )}
    </div>
  );
}
