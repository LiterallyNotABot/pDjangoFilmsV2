const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DEBUG = import.meta.env.VITE_DEBUG === "true";

if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined in your environment");
}

export const config = {
  BASE_URL,
  DEBUG,
};