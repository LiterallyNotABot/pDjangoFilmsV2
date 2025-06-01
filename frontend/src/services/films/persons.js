import { fetchData } from "../requestHandler";

export const getPersonById = (id, signal) =>
  fetchData(`/persons/${id}/`, { signal });

export const getFilmsByPerson = (
  personId,
  role = "Actor",
  page = 1,
  genre = null,
  language = null,
  sort = null,
  pageSize = 20,
  signal = null
) => {
  const params = {
    person_id: personId,
    role,
    page,
    page_size: pageSize,
    ...(genre && { genre }),
    ...(language && { language }),
    ...(sort && { sort }),
  };

  return fetchData("/films/by-person/", { params, signal });
};

export const getPersonRoles = (personId, signal) =>
  fetchData(`/persons/${personId}/roles/`, { signal });
