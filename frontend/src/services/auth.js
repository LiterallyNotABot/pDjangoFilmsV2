import useUserStore from "../store/user/userStore";

export function getAccessToken() {
  return useUserStore.getState().token || localStorage.getItem("access_token");
}
