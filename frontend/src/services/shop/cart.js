import { postData } from "../requestHandler";

export const checkoutCart = async (items) => {
  return postData("/store/create-payment/", { items });
};
