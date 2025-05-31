import { useSearchParams } from "react-router-dom";

const roles = ["Actor", "Director", "Producer", "Writer"];

export default function RoleFilterDropdown() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentRole = searchParams.get("role") || "Actor";

const handleSelect = (role) => {
  const newParams = new URLSearchParams(searchParams);
  newParams.set("role", role);
  setSearchParams(newParams);
};


  return (
    <div className="relative group text-sm cursor-pointer text-gray-300">
      <span className="hover:text-white">{currentRole}</span>
      <div className="absolute z-10 hidden group-hover:block bg-zinc-900 text-white border border-zinc-700 mt-2 rounded shadow-md">
        {roles.map((role) => (
          <div
            key={role}
            onClick={() => handleSelect(role)}
            className="px-4 py-2 hover:bg-zinc-800 whitespace-nowrap"
          >
            {role}
          </div>
        ))}
      </div>
    </div>
  );
}
