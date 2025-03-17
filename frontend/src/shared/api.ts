import axios from "axios";
import { AuthClientStore } from "../app/auth";

export const instance = axios.create({
  baseURL: "http://localhost:4000",
});

instance.interceptors.request.use(
  (request) => {
    const accessToken = AuthClientStore.getAccessToken();
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401) {
      try {
        const refreshToken = AuthClientStore.getRefreshToken();
        console.log(refreshToken);
        const response = await instance.post("auth/refresh", { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        console.log(response);
        AuthClientStore.setAccessToken(accessToken);
        AuthClientStore.setRefreshToken(newRefreshToken);
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        AuthClientStore.removeAccessToken();
        AuthClientStore.removeRefreshToken();
        return Promise.reject(refreshError);
      }
    }
  }
);
