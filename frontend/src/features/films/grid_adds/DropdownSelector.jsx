import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

export default function DropdownSelector({ label, value, options = [], onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <div ref={ref} className="relative text-sm text-gray-300">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-zinc-300 hover:text-white hover:border-green-500 transition-colors"
      >
        {value || label}
      </button>

      {open && (
        <div className="absolute z-20 bg-zinc-900 text-white border border-zinc-700 mt-1 rounded shadow-md min-w-full">
          {safeOptions.map((opt) => {
            const optionValue = typeof opt === "string" ? opt : opt?.value;
            const optionLabel = typeof opt === "string" ? opt : opt?.label;

            return (
              <div
                key={optionValue}
                onClick={() => {
                  onChange(optionValue);
                  setOpen(false);
                }}
                className="px-4 py-2 hover:border-l-4 hover:border-green-500 hover:pl-[0.75rem] hover:bg-zinc-800 cursor-pointer whitespace-nowrap transition-all duration-150 rounded-sm"
              >
                {optionLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

DropdownSelector.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      }),
    ])
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};
