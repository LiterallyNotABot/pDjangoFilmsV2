export default function FilmRatingStats({ filmId }) {
  return (
    <div className="mt-6 bg-zinc-900 p-4 rounded-lg text-sm text-gray-300">
      <p><strong>Average rating:</strong> 4.3</p>
      <p><strong>Fans:</strong> 8.5k</p>
      {/* Reemplazar por gráfica si luego usas Chart.js o similar */}
    </div>
  );
}
