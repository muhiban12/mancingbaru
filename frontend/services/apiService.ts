import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, API_TIMEOUT } from "../constants/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // LOGIKA PENTING:
    // Jika mengirim FormData, biarkan browser/axios set Content-Type otomatis (termasuk boundary)
    // Jika bukan FormData, set ke application/json
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers["Content-Type"];
      }
    } else {
      if (config.headers) {
        config.headers["Content-Type"] = "application/json";
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
