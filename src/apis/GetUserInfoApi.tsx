import axios from "axios";
import type { UserType } from "../types/UserType";

const API_DOMAIN = 'http://localhost:8080'



export const KAKAO_LOG_IN_URL = () => `${API_DOMAIN}/oauth2/authorization/kakao`

export const getSignInUserRequest = async (token: string): Promise<UserType> => {
  const response = await axios.get(`${API_DOMAIN}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  });
  return response.data;
};

