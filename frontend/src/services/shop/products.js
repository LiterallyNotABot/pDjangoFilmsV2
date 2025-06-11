import { fetchData } from "../requestHandler";

export const getProducts = async () => {
  return fetchData("/store/products/");
};
