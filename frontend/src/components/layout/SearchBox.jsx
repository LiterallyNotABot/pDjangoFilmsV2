import "./css/SearchBox.css";
import { useNavigate } from "react-router-dom";
import useSearchBox from "@/hooks/useSearchBox";

export default function SearchBox({ searchOpen, setSearchOpen }) {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm } = useSearchBox();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = searchTerm.trim();
      if (query.length >= 2) {
        navigate(`/search?q=${encodeURIComponent(query)}`);
        setSearchOpen(false);
      }
    }
  };

  return (
    <div className={`navbar__searchGroup ${searchOpen ? "search-open" : ""}`}>
      <button
        onClick={() => setSearchOpen(!searchOpen)}
        className="navbar__searchIcon"
        aria-label={searchOpen ? "Cerrar búsqueda" : "Abrir búsqueda"}
      >
        {searchOpen ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.364 5.636a1 1 0 0 0-1.414-1.414L12 9.172 7.05 4.222A1 1 0 0 0 5.636 5.636L10.586 10.586 5.636 15.536a1 1 0 1 0 1.414 1.414L12 12.828l4.95 4.95a1 1 0 0 0 1.414-1.414L13.414 10.586l4.95-4.95z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </button>

      <input
        type="text"
        placeholder="Buscar..."
        className="navbar__searchInput"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress}
      />
    </div>
  );
}
