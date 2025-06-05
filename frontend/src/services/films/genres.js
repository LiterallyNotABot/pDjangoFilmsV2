import axios from "../axios";

export const getAllGenres = async () => {
  const res = await axios.get("/genres/");
  return res.data;
};
