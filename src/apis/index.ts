import type { GetSignInUserResponseDto } from "./auth/response";

const API_DOMAIN = 'http://localhost:8080'
const API_BASE = `${API_DOMAIN}/api`;


export const SNS_SIGN_IN_URL = () => `${API_BASE}/auth/oauth2/kakao`

export const getSignInUserRequest = async (token: string): Promise<GetSignInUserResponseDto> => {
  const response = await axios.get<GetSignInUserResponseDto>(`${API_BASE}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
