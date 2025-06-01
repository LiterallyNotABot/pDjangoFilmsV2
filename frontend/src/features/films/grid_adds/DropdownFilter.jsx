import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

export default function DropdownFilter({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Cerrar si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative text-sm text-gray-300">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="hover:text-white focus:outline-none"
      >
        {value || label}
      </button>

      {open && (
        <div className="absolute z-20 bg-zinc-900 text-white border border-zinc-700 mt-2 rounded shadow-md">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-zinc-800 cursor-pointer whitespace-nowrap"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

DropdownFilter.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};
