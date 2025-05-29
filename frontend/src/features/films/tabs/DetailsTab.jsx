import Badge from "../../../components/ui/Badge";

export default function DetailsTab({ film }) {
  const studios = film.production_companies || [];
  const countries = film.countries || [];
  const languages = film.languages || [];

  return (
    <div className="text-sm text-gray-300 space-y-3">
      {studios.length > 0 && (
        <div className="flex">
          <div className="w-40 pr-4 text-white uppercase shrink-0">Studio</div>
          <div className="flex flex-wrap gap-2">
            {studios.map((s, i) => (
              <Badge key={`studio-${i}`} label={s.name} />
            ))}
          </div>
        </div>
      )}

      {countries.length > 0 && (
        <div className="flex">
          <div className="w-40 pr-4 text-white uppercase shrink-0">Country</div>
          <div className="flex flex-wrap gap-2">
            {countries.map((c, i) => (
              <Badge key={`country-${i}`} label={c.country_name} />
            ))}
          </div>
        </div>
      )}

      {languages.length > 0 && (
        <div className="flex">
          <div className="w-40 pr-4 text-white uppercase shrink-0">Language</div>
          <div className="flex flex-wrap gap-2">
            {languages.map((l, i) => (
              <Badge key={`lang-${i}`} label={l.language_name} />
            ))}
          </div>
        </div>
      )}

      {film.status && (
        <div className="flex">
          <div className="w-40 pr-4 text-white uppercase shrink-0">Status</div>
          <Badge label={film.status} />
        </div>
      )}

      {film.runtime && (
        <div className="flex">
          <div className="w-40 pr-4 text-white uppercase shrink-0">Runtime</div>
          <Badge label={`${film.runtime} mins`} />
        </div>
      )}

      {film.budget > 0 && (
        <div className="flex">
          <div className="w-40 pr-4 text-white uppercase shrink-0">Budget</div>
          <Badge label={`$${film.budget.toLocaleString()}`} />
        </div>
      )}

      {film.revenue > 0 && (
        <div className="flex">
          <div className="w-40 pr-4 text-white uppercase shrink-0">Revenue</div>
          <Badge label={`$${film.revenue.toLocaleString()}`} />
        </div>
      )}
    </div>
  );
}
