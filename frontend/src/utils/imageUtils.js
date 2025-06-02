// Devuelve la URL redimensionada para posters de TMDB
export const getSizedPosterUrl = (url, size = "md") => {
  const sizeMap = {
    sm: "w92",
    md: "w185",
    lg: "w342",
    xl: "w500",
  };
  if (!url) return getPlaceholderImage("poster");

  const base = "https://image.tmdb.org/t/p/";
  const path = url?.split("/").pop();
  return `${base}${sizeMap[size] || sizeMap.md}/${path}`;
};

export const getOptimizedBackdropUrl = (url) => {
  if (!url) return "/assets/no_img_placeholder.png";
  return url.includes("/original/")
    ? url.replace("/original/", "/w1280/")
    : url;
};

// Placeholder para posters u otros tipos
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

// Clase de Tailwind según aspect ratio, si usás ratios variables
export const getImageAspectClass = (ratio = "2:3") => {
  const map = {
    "1:1": "aspect-square",
    "2:3": "aspect-[2/3]",
    "3:2": "aspect-[3/2]",
    "16:9": "aspect-video",
  };
  return map[ratio] || "aspect-[2/3]";
};

// Simple validador de URL de imagen
export const isValidImageUrl = (url) => {
  return typeof url === "string" && url.trim() !== "" && url.startsWith("http");
};
