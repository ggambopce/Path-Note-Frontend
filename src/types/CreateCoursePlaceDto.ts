export interface CoursePlaceDto {
  poi_id: number;
  sequence_index: number;
  place_name: string;
  place_enter_time: string;
  place_leave_time: string;
}

export interface CourseCreateRequestDto {
  user_id: number;
  course_name: string;
  course_category: string
  course_description: string;
  course_places: CoursePlaceDto[];
}
