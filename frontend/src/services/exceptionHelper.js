export function handleApiError(error) {
  if (error?.code === "ERR_CANCELED") return null;

  if (error?.custom === "session_expired") {
    return new Error("Your session has expired. Please log in again.");
  }

  const message =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    "An unexpected error occurred.";

  return new Error(message);
}

