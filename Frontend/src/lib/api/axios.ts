import axios, { AxiosHeaders } from "axios";
import { API_URL } from "../../env";
import { getToken } from "../token/token_storage";

const api = axios.create({
  baseURL: API_URL,
  headers: new AxiosHeaders({
    "Content-Type": "application/json",
  }),
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = new AxiosHeaders(config.headers).set(
      "Authorization",
      `Bearer ${token}`
    );
  }
  return config;
});

export default api;