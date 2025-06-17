import { postData, patchData, deleteData } from "@/services/requestHandler";

export const postLog = (payload, signal = null) => {
  return postData("/reviews/log/", payload, { signal });
};

export const patchLog = (logId, payload, signal = null) => {
  return patchData(`/reviews/log/${logId}/`, payload, { signal });
};

export const deleteLog = (logId, signal = null) => {
  return deleteData(`/reviews/log/${logId}/`, { signal });
};