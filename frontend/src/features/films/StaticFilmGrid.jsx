import PropTypes from "prop-types";
import selectPlaceholder from "@/assets/select_fav_placeholder.png";

export default function StaticFilmGrid({ title, items = [], renderItem }) {
  const filled = items.slice(0, 4);
  while (filled.length < 4) {
    filled.push(null);
  }

  return (
    <section className="w-full space-y-4">
      {title && <h3 className="text-xl font-semibold">{title}</h3>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
        {filled.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            {item ? (
              renderItem(item)
            ) : (
              <div className="relative aspect-[2/3] w-full rounded overflow-hidden border border-zinc-700 bg-zinc-900">
                <img
                  src={selectPlaceholder}
                  alt="Select a film"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

StaticFilmGrid.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
};
