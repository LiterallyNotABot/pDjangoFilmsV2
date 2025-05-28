import axios from "../axios";

export const getPopularLists = async (limit = 10) => {
  const response = await axios.get(`/users/lists/popular/?limit=${limit}`);
  return response.data;
};

export async function getFriendsLists(limit = 6) {
  const response = await axios.get(`/users/lists/friends/?limit=${limit}`);
  return response.data;
}
