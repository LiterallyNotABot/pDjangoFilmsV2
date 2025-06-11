import { fetchData } from "../requestHandler";

export const getUserOrders = async () => {
  return fetchData("/store/purchases/");
};
