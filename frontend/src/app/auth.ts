import { instance } from "../shared/api";

const ACCESS_TOKEN_KEY = "access.token";
const REFRESH_TOKEN_KEY = "refresh.token";

export class AuthClientStore {
  static getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  static setAccessToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  static removeAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  static getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  static removeRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

const userLogin = async () => {
  const createUserDTO = {
    login: "reanod",
    password: "12345",
  };
  const res = await instance.post("auth/login", createUserDTO);

  return res;
};

export const initAuth = async () => {
  const accessToken = AuthClientStore.getAccessToken();
  if (accessToken) return;
  const res = await userLogin();
  AuthClientStore.setAccessToken(res.data.accessToken);
  AuthClientStore.setRefreshToken(res.data.refreshToken);
};
