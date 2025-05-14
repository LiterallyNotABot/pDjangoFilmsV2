// services/users.js
import axios from "axios";

const API_URL = "http://localhost:8000/users"; // ajusta a tu backend real

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login/`, {
    email,
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
