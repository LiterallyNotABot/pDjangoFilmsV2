import { useSearchParams } from "react-router-dom";

export default function FilterSortBar({ filters = [], sortOptions = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParam = (key, value) => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };

  const getLabel = (key, options) => {
    const current = searchParams.get(key);
    return options.find(o => o.value === current)?.label || key.toUpperCase();
  };

  return (
    <div className="flex gap-4 flex-wrap mb-4 text-sm text-gray-400">
      {filters.map(({ key, options }) => (
        <div key={key} className="relative group cursor-pointer">
          <span className="hover:text-white">{getLabel(key, options)}</span>
          <div className="absolute z-10 hidden group-hover:block bg-zinc-900 text-white border border-zinc-700 mt-2 rounded shadow-md">
            {options.map(opt => (
              <div
                key={opt.value}
                className="px-4 py-2 hover:bg-zinc-800 whitespace-nowrap"
                onClick={() => updateParam(key, opt.value)}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      ))}

      {sortOptions.length > 0 && (
        <div className="relative group cursor-pointer">
          <span className="hover:text-white">
            Sort by {getLabel("sort", sortOptions)}
          </span>
          <div className="absolute z-10 hidden group-hover:block bg-zinc-900 text-white border border-zinc-700 mt-2 rounded shadow-md">
            {sortOptions.map(opt => (
              <div
                key={opt.value}
                className="px-4 py-2 hover:bg-zinc-800 whitespace-nowrap"
                onClick={() => updateParam("sort", opt.value)}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
