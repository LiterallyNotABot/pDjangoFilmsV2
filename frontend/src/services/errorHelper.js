export function handleApiError(error) {
  if (error?.custom === "session_expired") {
    return "Your session has expired. Please log in again.";
  }

  return (
    error?.response?.data?.detail || // DRF errors
    error?.response?.data?.message || // Custom backend messages
    error?.message || // JS errors
    "An unexpected error occurred."
  );
}
