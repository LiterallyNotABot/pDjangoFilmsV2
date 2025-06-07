export default function PersonCard({ person }) {
  return (
    <div className="flex flex-col items-center text-center text-white">
      <div className="w-48 h-64 mb-2 rounded-lg overflow-hidden border-2 border-transparent hover:border-yellow-500 transition-all duration-300 shadow-md transform hover:scale-105">
        <img
          src={person.picture_url}
          alt={person.name}
          className="object-cover w-full h-full"
        />
      </div>
      <h2 className="text-lg font-semibold">{person.name}</h2>
    </div>
  );
}
