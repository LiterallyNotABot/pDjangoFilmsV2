import { useSearchParams } from "react-router-dom";
import { useState, useRef } from "react";
import PropTypes from "prop-types";

export default function FilterSortBar({ filters = [], sortOptions = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openKey, setOpenKey] = useState(null);
  const containerRef = useRef();

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(key, value);
    setSearchParams(newParams);
    setOpenKey(null);
  };

  const getLabel = (key, options) => {
    const current = searchParams.get(key);
    return options.find(o => o.value === current)?.label || key.toUpperCase();
  };

  const toggleDropdown = (key) => {
    setOpenKey(prev => (prev === key ? null : key));
  };

  return (
    <div
      className="flex gap-4 flex-wrap mb-4 text-sm text-gray-400 relative"
      ref={containerRef}
    >
      {[...filters, ...(sortOptions.length > 0 ? [{ key: "sort", options: sortOptions }] : [])].map(
        ({ key, options }) => (
          <div key={key} className="relative">
            <button
              onClick={() => toggleDropdown(key)}
              className="hover:text-white focus:outline-none"
            >
              {key === "sort" ? "Sort by " : ""}
              {getLabel(key, options)}
            </button>

            {openKey === key && (
              <div className="absolute bg-zinc-900 text-white border border-zinc-700 mt-2 rounded shadow-md z-20 min-w-max">
                {options.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => updateParam(key, opt.value)}
                    className="px-4 py-2 hover:bg-zinc-800 cursor-pointer whitespace-nowrap"
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
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
