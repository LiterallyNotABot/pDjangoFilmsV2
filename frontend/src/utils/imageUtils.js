// Devuelve la URL redimensionada para posters de TMDB
export const getSizedPosterUrl = (url, size = "md") => {
  const sizeMap = {
    sm: "w92",
    md: "w185",
    lg: "w342",
    xl: "w500",
  };

  if (!url || typeof url !== "string") return null;

  const tmdbBase = "https://image.tmdb.org/t/p/";
  const desiredSize = sizeMap[size] || sizeMap.md;

  // Caso: URL completa de TMDB (ya incluye base)
  if (url.startsWith(tmdbBase)) {
    const filename = url.split("/").pop();
    return `${tmdbBase}${desiredSize}/${filename}`;
  }

  // Caso: ruta relativa de TMDB (ej. "/kqjL17yufvn9OVLyXYpvtyrFfak.jpg")
  if (url.startsWith("/")) {
    return `${tmdbBase}${desiredSize}${url}`;
  }

  // Si no es TMDB, se devuelve tal cual
  return url;
};

// Devuelve backdrop optimizado (reemplaza /original/ por w1280)
export const getOptimizedBackdropUrl = (url) => {
  if (!url || typeof url !== "string") {
    return "/assets/backdrop_placeholder.png";
  }

  const tmdbBase = "https://image.tmdb.org/t/p/";

  // Si es completa de TMDB y usa /original/
  if (url.startsWith(tmdbBase) && url.includes("/original/")) {
    return url.replace("/original/", "/w1280/");
  }

  // Si es solo un path relativo
  if (url.startsWith("/")) {
    return `${tmdbBase}w1280${url}`;
  }

  return url;
};

// Placeholder directo para tipos comunes
export const getPlaceholderImage = (type = "poster") => {
  switch (type) {
    case "avatar":
      return "/assets/avatar_placeholder.png";
    case "backdrop":
      return "/assets/backdrop_placeholder.png";
    case "poster":
    default:
      return "/assets/no_img_placeholder.png";
  }
};

// Clase de Tailwind según aspect ratio
export const getImageAspectClass = (ratio = "2:3") => {
  const map = {
    "1:1": "aspect-square",
    "2:3": "aspect-[2/3]",
    "3:2": "aspect-[3/2]",
    "16:9": "aspect-video",
  };
  return map[ratio] || "aspect-[2/3]";
};

// Validador simple de URL de imagen
export const isValidImageUrl = (url) => {
  return typeof url === "string" && url.trim().startsWith("http");
};
