interface CoursePlaceCreateProps {
  onCancel: () => void;        // ← 부모에서 내려줄 콜백
}

//          component: 코스 장소 등록 컴포넌트          //
export default function CoursePlaceCreate({ onCancel }: CoursePlaceCreateProps) {

    //          render: 코스 장소 등록 컴포넌트 랜더링          //
    return (
    <section className="rounded-3xl bg-white shadow-lg ring-1 ring-black/5 p-5 md:p-6">
      
      {/* 패널 타이틀 */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-extrabold leading-8 text-gray-900">
            코스 생성
        </div>
        <div className="flex space-x-2">
            <button
            type="button"
            className="inline-flex items-center rounded-xl bg-main-200 px-3 py-1.5 
                        text-white text-[13px] font-medium shadow-sm 
                        hover:bg-main-300 focus:outline-none focus:ring-2 
                        focus:ring-main-200/40"
            >
            입력 완료
            </button>
            <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-xl bg-main-200 px-3 py-1.5 
                        text-white text-[13px] font-medium shadow-sm 
                        hover:bg-main-300 focus:outline-none focus:ring-2 
                        focus:ring-main-200/40"
            >
            취소
            </button>
        </div>
        </div>

      {/* 패널 타이틀 */}
      <div className="text-[13px] font-bold leading-8">장소 리스트</div>
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-gray-900 mb-4">
        <li className="flex items-center gap-1.5">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
                <span className="font-semibold text-[14px]">1.</span>
                <span className="text-[14px] text-gray-900 truncate max-w-[12rem]">
                대전대학교
                </span>
            </div>
            <span className="text-[12px] text-gray-400 self-end">대학교</span>
        </div>
        </li>
        <li className="flex items-center gap-1.5">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
                <span className="font-semibold text-[14px]">2.</span>
                <span className="text-[14px] text-gray-900 truncate max-w-[12rem]">
                성심당
                </span>
            </div>
            <span className="text-[12px] text-gray-400 self-end">빵집</span>
        </div>
        </li>
        <li className="flex items-center gap-1.5">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
                <span className="font-semibold text-[14px]">3.</span>
                <span className="text-[14px] text-gray-900 truncate max-w-[12rem]">
                강릉길감자
                </span>
            </div>
            <span className="text-[12px] text-gray-400 self-end">문화재</span>
        </div>
        </li>
      </ul>

      {/* 일정 요약 */}
      <div className="grid grid-cols-[auto_1fr]  gap-x-4 gap-y-2 items-start mb-4">
        <label className="text-[13px] font-bold leading-8">코스 소요 시간</label>
        <div className="flex items-center gap-8 text-[13px]">
          <div className="text-gray-700">12:30</div>
          <div className="text-gray-700">15:30</div>
          <div className="text-gray-500">3시간</div>
        </div>
      </div>

      {/* 코스 이름 */}
      <div className="grid grid-cols-[auto_1fr]  font-bold  gap-x-4 gap-y-2 items-start mb-3">
        <label className="text-[13px] leading-9">코스 이름</label>
        <div className="w-full">
          <div
            aria-hidden
            className="h-9 rounded-xl bg-main-100"
          />
        </div>
      </div>

      {/* 코스 테마 해시 태그 */}
      <div className="grid grid-cols-[auto_1fr] font-bold gap-x-4 gap-y-2 items-start mb-3">
        <label className="text-[13px] leading-9">코스 테마 해시 태그</label>
        <div className="w-full">
          <div
            aria-hidden
            className="h-9 rounded-xl bg-main-100"
          />
        </div>
      </div>

      {/* 이미지 업로드 */}
      <div className="grid grid-cols-[auto_1fr] font-bold gap-x-4 gap-y-2 items-start mb-4">
        <label className="text-[13px] leading-9">이미지 업로드</label>
        <div className="w-12">
          <div className=" rounded-2xl border-2 border-dashed border-main-100 bg-slate-100/70 flex items-center justify-center">
            <span className="text-2xl text-main-200 select-none">＋</span>
          </div>
        </div>
      </div>

      {/* 코스 설명 */}
      <div className="grid grid-cols-[auto_1fr] font-bold  gap-x-4 gap-y-2 items-start">
        <label className="text-[13px] leading-10">코스 설명</label>
        <div className="w-full">
          <div
            aria-hidden
            className="h-40 md:h-48 rounded-2xl bg-main-100"
          />
        </div>
      </div>
    </section>
  );
}