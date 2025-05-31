import RoleFilterDropdown from "./RoleFilterDropdown";
import FilterSortBar from "../../../components/ui/FilterSortBar";
import PropTypes from "prop-types";

export default function PersonToolbar({ roles = [], filters = [], sortOptions = [] }) {
  return (
    <div className="flex flex-wrap gap-6 justify-between items-center mb-4">
      {roles.length > 0 && <RoleFilterDropdown roles={roles} />}
      <FilterSortBar filters={filters} sortOptions={sortOptions} />
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
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ),
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};
