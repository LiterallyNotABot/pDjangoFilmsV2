import axios from "../axios";

export const getFilmsByCompany = async (companyId) => {
  const res = await axios.get("/films/", {
    params: { company: companyId },
  });
  return res.data;
};
