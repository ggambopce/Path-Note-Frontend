import axios from 'axios';
import type {CourseCreateRequestDto} from "../types/CreateCoursePlaceDto";

const API_BASE_URL = "http://localhost:8080"; // 실제 서버 주소로 교체

export const createCourse = async (requestBody: CourseCreateRequestDto) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/courses`,   // 실제 엔드포인트에 맞게 수정
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("[SUCCESS] 코스 생성 응답:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("[ERROR]", error.response.data);
      return error.response.data;
    } else {
      console.error("[NETWORK ERROR]", error.message);
      return null;
    }
  }
};
