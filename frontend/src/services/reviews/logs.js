import { postData } from "@/services/requestHandler";

export const postLog = (payload, signal = null) => {
  return postData("/reviews/log/", payload, { signal });
};