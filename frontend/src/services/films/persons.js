import axios from "../axios";

export const getPersonById = async (id) => {
  const res = await axios.get(`/persons/${id}/`);
  return res.data;
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
  const params = {
    person_id: personId,
    role,
    page,         
    page_size: pageSize
  };

  if (genre) params.genre = genre;
  if (language) params.language = language;
  if (sort) params.sort = sort;

  const res = await axios.get("/films/by-person/", { params });
  return res.data;
};


export const getPersonRoles = async (personId) => {
  const res = await axios.get(`/persons/${personId}/roles/`);
  return res.data;
};
