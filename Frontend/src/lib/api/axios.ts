import axios, { AxiosHeaders } from "axios";
import { API_URL } from "../../env";
import { getToken } from "../token/token_storage";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  config.headers = AxiosHeaders.from(config.headers);

  const token = getToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  if (config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  } else {
    config.headers.set("Content-Type", "application/json");
  }

  return config;
});

export default api;