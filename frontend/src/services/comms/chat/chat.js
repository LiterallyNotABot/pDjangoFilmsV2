import { fetchData, postData } from "../../requestHandler";

export const getUserChats = (signal) =>
  fetchData("/comms/chats/", { signal });

export const getChatMessages = (chatId, signal) =>
  fetchData(`/comms/chats/${chatId}/messages/`, { signal });

export const createChat = (data) =>
  postData("/comms/chats/", data);

export const joinChatByKey = (key) => {
  return postData('/comms/chats/join/', { key });
};

export const leaveChat = (chatKey) =>
  deleteData(`/comms/chats/${chatKey}/leave/`);