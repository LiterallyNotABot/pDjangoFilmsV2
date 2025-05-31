export default function PersonInfo({ person }) {
  return (
    <div className="flex flex-col items-center text-center mb-6">
      <img src={person.picture_url} alt={person.name} className="w-40 h-60 rounded shadow-lg mb-4 object-cover" />
      <h1 className="text-2xl font-bold text-white mb-2">{person.name}</h1>
      {person.biography && (
        <p className="text-sm text-gray-400 max-w-2xl">{person.biography}</p>
      )}
    </div>
  );
}
