import { useState } from "react";
import Badge from "../../../components/ui/Badge";
import Tooltip from "../../../components/ui/Tooltip";

export default function CastTab({ film }) {
  const [showAll, setShowAll] = useState(false);
  const cast =
    film.crew?.filter((m) => m.role.name.toLowerCase() === "actor") || [];
  const visibleCast = showAll ? cast : cast.slice(0, 20);

  return (
    <div className="flex flex-wrap gap-2">
      {visibleCast.map((member, i) => (
        <div key={i} className="inline-flex">
          <Tooltip
            content={member.character || "No role"}
            position="top"
            bgColor="bg-red-700"
          >
            <Badge label={member.person.name} />
          </Tooltip>
        </div>
      ))}

      {cast.length > 20 && !showAll && (
        <Badge
          label="Show All..."
          onClick={() => setShowAll(true)}
          color="bg-zinc-800"
          hoverColor="hover:underline"
          textColor="text-white"
        />
      )}
    </div>
  );
}
