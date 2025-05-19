// services/users.js
import axios from "axios";

const API_URL = "http://localhost:8000/users";

export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_URL}/login/`, {
    username,
    password,
  });
  return response.data;
};

export const registerUser = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/register/`, {
    username,
    email,
    password,
  });
  return response.data;
};
