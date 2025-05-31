import Badge from "../../../components/ui/Badge";

export default function DetailsTab({ film }) {
  const studios = film.production_companies || [];
  const countries = film.countries || [];
  const languages = film.languages || [];

  return (
    <div className="text-sm text-gray-300">
      {studios.length > 0 && (
        <div className="flex items-start mb-2">
          <div className="w-40 pr-4 text-white uppercase shrink-0 pt-1">Studio</div>
          <div className="flex flex-wrap gap-2 items-start min-h-[2rem]">
            {studios.map((s, i) => (
              <Badge
                key={`studio-${i}`}
                label={s.name}
                type="company"
                id={s.company_id}
              />
            ))}
          </div>
        </div>
      )}

      {countries.length > 0 && (
        <div className="flex items-start mb-2">
          <div className="w-40 pr-4 text-white uppercase shrink-0 pt-1">Country</div>
          <div className="flex flex-wrap gap-2 items-start min-h-[2rem]">
            {countries.map((c, i) => (
              <Badge
                key={`country-${i}`}
                label={c.country_name}
                type="country"
                id={c.country_id}
              />
            ))}
          </div>
        </div>
      )}

      {languages.length > 0 && (
        <div className="flex items-start mb-2">
          <div className="w-40 pr-4 text-white uppercase shrink-0 pt-1">Language</div>
          <div className="flex flex-wrap gap-2 items-start min-h-[2rem]">
            {languages.map((l, i) => (
              <Badge
                key={`lang-${i}`}
                label={l.language_name}
                type="language"
                id={l.language_id}
              />
            ))}
          </div>
        </div>
      )}

      {film.status && (
        <div className="flex items-start mb-2">
          <div className="w-40 pr-4 text-white uppercase shrink-0 pt-1">Status</div>
          <div className="flex items-start min-h-[2rem]">
            <Badge label={film.status} type="noop" />
          </div>
        </div>
      )}

      {film.runtime && (
        <div className="flex items-start mb-2">
          <div className="w-40 pr-4 text-white uppercase shrink-0 pt-1">Runtime</div>
          <div className="flex items-start min-h-[2rem]">
            <Badge label={`${film.runtime} mins`} type="noop" />
          </div>
        </div>
      )}

      {film.budget > 0 && (
        <div className="flex items-start mb-2">
          <div className="w-40 pr-4 text-white uppercase shrink-0 pt-1">Budget</div>
          <div className="flex items-start min-h-[2rem]">
            <Badge label={`$${film.budget.toLocaleString()}`} type="static" />
          </div>
        </div>
      )}

      {film.revenue > 0 && (
        <div className="flex items-start mb-2">
          <div className="w-40 pr-4 text-white uppercase shrink-0 pt-1">Revenue</div>
          <div className="flex items-start min-h-[2rem]">
            <Badge label={`$${film.revenue.toLocaleString()}`} type="static" />
          </div>
        </div>
      )}
    </div>
  );
}
