import api from "../axios";
import { handleApiError } from "../errorHelper";
export const getPersonById = async (id) => {
  try {
    const res = await api.get(`/persons/${id}/`);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const getFilmsByPerson = async (
  personId,
  role = "Actor",
  page = 1,
  genre = null,
  language = null,
  sort = null,
  pageSize = 20
) => {
  try {
    const params = {
      person_id: personId,
      role,
      page,
      page_size: pageSize,
    };
    if (genre) params.genre = genre;
    if (language) params.language = language;
    if (sort) params.sort = sort;

    const res = await api.get("/films/by-person/", { params });
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const getPersonRoles = async (personId) => {
  try {
    const res = await api.get(`/persons/${personId}/roles/`);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};
