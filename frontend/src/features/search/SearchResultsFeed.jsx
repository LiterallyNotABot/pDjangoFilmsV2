import PropTypes from "prop-types";
import SearchResultCard from "./SearchResultCard";

export default function SearchResultsFeed({ results }) {
  const sections = [
    { key: "films", label: "Films", type: "film" },
    { key: "persons", label: "People", type: "person" },
    { key: "users", label: "Users", type: "user" },
    { key: "lists", label: "Lists", type: "list" },
  ];

  return (
    <div className="space-y-10">
      {sections.map(({ key, label, type }, index) => {
        const items = results?.[key] || [];
        if (items.length === 0) return null;

        return (
          <section key={key}>
            {index !== 0 && <hr className="border-zinc-700 mb-4" />}
            <h2 className="text-lg text-white font-semibold mb-4">{label}</h2>
            <div className="space-y-6">
              {items.map((item, idx) => (
                <SearchResultCard key={`${key}-${idx}`} type={type} data={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

SearchResultsFeed.propTypes = {
  results: PropTypes.shape({
    films: PropTypes.array,
    persons: PropTypes.array,
    users: PropTypes.array,
    lists: PropTypes.array,
  }),
};
