export function handleApiError(error) {
  if (error?.code === "ERR_CANCELED") return null;

  if (error?.custom === "session_expired") {
    const sessionError = new Error("Your session has expired. Please log in again.");
    sessionError.custom = "session_expired";
    return sessionError;
  }

  const status = error?.response?.status;

  const err = new Error(
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    "An unexpected error occurred."
  );

  if (status) err.status = status;

  err.code = error?.code;
  err.response = error?.response;

  return err;
}

export function isNotFoundError(error) {
  return (
    error?.response?.status === 404 ||
    error?.status === 404 ||
    error?.code === "ERR_NOT_FOUND"
  );
}
