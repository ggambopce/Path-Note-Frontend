// utils/buildCourseCreateRequest.ts
import type { CourseCreateRequestDto, CoursePlaceDto } from "../types/CreateCoursePlaceDto";
import type { CoursePlaceType } from "../types/CoursePlaceType";

//          function: 시간 타입 요청 양식 변경 함수          //
function formatToYmdHm(input?: string) {
  if (!input || input.trim() === "") return null; // 빈 문자열 → null
  const d = new Date(input);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function buildCourseCreateRequest(
  userId: number,
  payload: { course_name: string; course_category: string; course_description: string; },
  places: CoursePlaceType[],
): CourseCreateRequestDto {
  const course_places: CoursePlaceDto[] = places.map((p, idx) => {
    const enter = formatToYmdHm(p.arrivalTime);
    const leave = formatToYmdHm(p.departureTime);

    const item: Partial<CoursePlaceDto> & { poi_id: number; sequence_index: number } = {
      poi_id: Number(selectedPOI.id), // 실제 POI 식별자 필드에 맞춰 조정
      sequence_index: idx + 1,
    };
    if (enter) item.place_enter_time = enter;   // null이면 키 생략
    if (leave) item.place_leave_time = leave;

    return item as CoursePlaceDto;
  });

  const req: CourseCreateRequestDto = {
    user_id: Number(userId),
    course_name: payload.course_name,
    course_category: payload.course_category,
    course_description: payload.course_description,
    course_places,
  };

  // 전송 직전 확인용
  console.log("[REQ] /api/courses payload =", JSON.stringify(req, null, 2));
  return req;
}