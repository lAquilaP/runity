
import axios from "axios";
import { Platform } from "react-native";

const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export async function login(email, password) {
  const response = await api.post("/auth/login", {
    email: email.trim().toLowerCase(),
    password,
  });

  return response.data;
}

export async function register({
  name,
  username,
  email,
  password,
}) {
  const response = await api.post("/auth/register", {
    name: name.trim(),
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    password,
  });

  return response.data;
}
