import DropdownFilter from "../grid_adds/DropdownFilter";
import { useSearchParams } from "react-router-dom";

const roles = ["Actor", "Director", "Producer", "Writer"];

export default function RoleFilterDropdown() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentRole = searchParams.get("role") || "Actor";

  const handleChange = (role) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("role", role);
    setSearchParams(newParams);
  };

  return (
    <DropdownFilter
      label="Role"
      value={currentRole}
      options={roles}
      onChange={handleChange}
    />
  );
}
