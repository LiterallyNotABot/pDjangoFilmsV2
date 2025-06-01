import RoleFilterDropdown from "./RoleFilterDropdown";
import FilterSortBar from "../../../components/ui/FilterSortBar";
import PropTypes from "prop-types";
import { memo } from "react";

function PersonToolbar({ roles = [], filters = [], sortOptions = [] }) {
  const hasFilters = filters.length > 0 || sortOptions.length > 0;

  return (
    <div className="flex flex-wrap gap-6 justify-between items-center mb-4">
      {roles.length > 0 && <RoleFilterDropdown roles={roles} />}
      {hasFilters && <FilterSortBar filters={filters} sortOptions={sortOptions} />}
    </div>
  );
}

PersonToolbar.propTypes = {
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  filters: PropTypes.array,
  sortOptions: PropTypes.array,
};

export default memo(PersonToolbar);
