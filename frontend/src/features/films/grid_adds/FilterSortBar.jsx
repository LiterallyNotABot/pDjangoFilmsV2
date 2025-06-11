import { useSearchParams } from "react-router-dom";
import DropdownSelector from "./DropdownSelector";
import PropTypes from "prop-types";

export default function FilterSortBar({ filters = [], sortOptions = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(key, value);
    setSearchParams(newParams);
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {filters.map(({ key, options }) => {
        const currentValue = searchParams.get(key);
        const selectedLabel = options.find((o) => o.value === currentValue)?.label;

        return (
          <DropdownSelector
            key={key}
            label={key.toUpperCase()}
            value={selectedLabel}
            options={options}
            onChange={(val) => updateParam(key, val)}
          />
        );
      })}

      {sortOptions.length > 0 && (
        (() => {
          const key = "sort";
          const currentValue = searchParams.get(key);
          const selectedLabel = sortOptions.find((o) => o.value === currentValue)?.label;

          return (
            <DropdownSelector
              key="sort"
              label={`Sort by: ${selectedLabel || "Select"}`}
              value=""
              options={sortOptions}
              onChange={(val) => updateParam(key, val)}
            />
          );
        })()
      )}
    </div>
  );
}

FilterSortBar.propTypes = {
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
