
//          component: 코스 장소 아이템 컴포넌트          //
export default function CoursePlaceItem() {
  
    //          render: 코스 장소 아이템 컴포넌트 랜더링          //
    return (
    <li className="rounded-2xl bg-white shadow-md ring-1 ring-black/5 px-4 py-3">
      <div className="grid grid-cols-[28px_1fr] gap-3">
        {/* 아이콘 열 */}
        <div className="flex flex-col items-center gap-2 text-gray-500 pt-1">
          {/* 매장 아이콘 */}
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <path
              d="M3 9l1-4h16l1 4v9a2 2 0 0 1-2 2h-3v-5H8v5H5a2 2 0 0 1-2-2V9zM4 5h16"
              stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>

          {/* 위치 아이콘 */}
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path
              d="M12 2a6 6 0 0 0-6 6c0 4.6 6 12 6 12s6-7.4 6-12a6 6 0 0 0-6-6zm0 8.2a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4z"
              fill="currentColor"
            />
          </svg>

          {/* 카테고리 아이콘 */}
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>

        {/* 내용 열 */}
        <div className="min-w-0">
          {/* 상단: 장소명 + 카테고리 칩 */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-semibold text-gray-900 truncate">장소 이름</h3>
            <span className="shrink-0 rounded-full border border-gray-200 bg-gray-100 text-gray-700 px-2 py-0.5 text-[11px]">
              카테고리
            </span>
          </div>

          {/* 주소 */}
          <div className="mt-1 text-[13px] text-gray-700 leading-5 break-keep">
            서울 중구 새문안로5길 00
          </div>

          {/* 서브카테고리(예: 한식/빵집/문화) */}
          <div className="mt-0.5 text-[12px] text-gray-500">세부 카테고리</div>

          {/* 시간 영역 */}
          <div className="mt-2 space-y-1.5">
            {/* 도착 */}
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-[12px] text-gray-600">도착</span>
              <div
                aria-hidden
                className="w-1/3 md:h-4 rounded-2xl bg-main-100"
              />
            </div>
            {/* 출발 */}
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-[12px] text-gray-600">출발</span>
              <div
                aria-hidden
                className="w-1/3 md:h-4 rounded-2xl bg-main-100"
              />

            </div>
          </div>
        </div>
      </div>
    </li>
  );
}