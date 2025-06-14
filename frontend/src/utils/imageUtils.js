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

  if (url.startsWith(tmdbBase)) {
    const filename = url.split("/").pop();
    return `${tmdbBase}${desiredSize}/${filename}`;
  }

  if (url.startsWith("/")) {
    return `${tmdbBase}${desiredSize}${url}`;
  }

  return url;
};

export const getOptimizedBackdropUrl = (url) => {
  if (!url || typeof url !== "string") {
    return "/assets/backdrop_placeholder.png";
  }

  const tmdbBase = "https://image.tmdb.org/t/p/";

  if (url.startsWith(tmdbBase) && url.includes("/original/")) {
    return url.replace("/original/", "/w1280/");
  }

  if (url.startsWith("/")) {
    return `${tmdbBase}w1280${url}`;
  }

  return url;
};

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

export const getImageAspectClass = (ratio = "2:3") => {
  const map = {
    "1:1": "aspect-square",
    "2:3": "aspect-[2/3]",
    "3:2": "aspect-[3/2]",
    "16:9": "aspect-video",
  };
  return map[ratio] || "aspect-[2/3]";
};

export const isValidImageUrl = (url) => {
  return typeof url === "string" && url.trim().startsWith("http");
};
