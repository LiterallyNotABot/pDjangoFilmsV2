import axios from "../axios";

export const getPersonById = async (id) => {
  const res = await axios.get(`/persons/${id}/`);
  return res.data;
};

export const getFilmsByPerson = async (personId, role = "Actor") => {
  const res = await axios.get("/films/by-person/", {
    params: { person_id: personId, role },
  });
  return res.data;
};

export const getPersonRoles = async (personId) => {
  const res = await axios.get(`/persons/${personId}/roles/`);
  return res.data;
};