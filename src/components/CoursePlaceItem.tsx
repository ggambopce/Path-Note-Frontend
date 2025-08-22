interface CoursePlaceItemProps {
  id: number;
  index: number;
  name: string;
  address: string;
  phone?: string;
  onRemove: (id: number) => void;
}


//          component: 코스 장소 아이템 컴포넌트          //
export default function CoursePlaceItem({ id, index, name, address, phone, onRemove }: CoursePlaceItemProps) {

    //          render: 코스 장소 아이템 컴포넌트 랜더링          //
    return (
    <div className="rounded-2xl bg-white shadow-md ring-1 ring-black/5 px-4 py-3">
      <div className="space-y-2">
        {/* 0) 순번 + 삭제 버튼 */}
        <div className="flex items-center justify-between">
          <div className="text-[13px] font-bold text-gray-600">{index}</div>
          <button
            type="button"
            className="text-gray-400 hover:text-red-500 transition-colors"
            onClick={() => onRemove(id)}
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 1) 장소명 행: 상점 아이콘 + 제목/칩 */}
        <div className="flex items-start gap-3">
          {/* 상점 아이콘 */}
          <svg aria-hidden viewBox="0 0 24 24" className="w-6 h-6 text-gray-500">
            <path
              d="M3 9l1-4h16l1 4v9a2 2 0 0 1-2 2h-3v-5H8v5H5a2 2 0 0 1-2-2V9zM4 5h16"
              stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[15px] font-semibold text-gray-900 truncate">성심당</h3>
            </div>
          </div>
        </div>

        {/* 2) 주소 행: 위치 아이콘 + 주소 */}
        <div className="flex items-start gap-3">
          <svg aria-hidden viewBox="0 0 24 24" className="w-5 h-5 mt-0.5 text-gray-500">
            <path
              d="M12 2a6 6 0 0 0-6 6c0 4.6 6 12 6 12s6-7.4 6-12a6 6 0 0 0-6-6zm0 8.2a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4z"
              fill="currentColor"
            />
          </svg>
          <div className="text-[13px] text-gray-700 leading-5 break-keep">
            대전 중구 새문안로5길 00
          </div>
        </div>

        {/* 3) 카테고리 행: 태그 아이콘 + 세부 카테고리 */}
        <div className="flex items-start gap-3">
          {/* 태그(라벨) 아이콘 */}
          <svg aria-hidden viewBox="0 0 24 24" className="w-5 h-5 text-gray-500">
            <path
              d="M20 13.59L10.41 4H5a1 1 0 0 0-1 1v5.41L13.59 20a2 2 0 0 0 2.83 0L20 16.41a2 2 0 0 0 0-2.82zM7.5 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"
              fill="currentColor"
            />
          </svg>
          <div className="text-[12px] text-gray-500">빵집</div>
        </div>

        {/* 4) 시간 영역: 아이콘 열 폭만큼 들여쓰기 */}
        <div className="mt-2 space-y-1.5">
          {/* 도착 */}
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[12px] text-gray-600">도착</span>
            <div aria-hidden className="w-1/3 md:h-4 rounded-2xl bg-main-100" />
          </div>
          {/* 출발 */}
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[12px] text-gray-600">출발</span>
            <div aria-hidden className="w-1/3 md:h-4 rounded-2xl bg-main-100" />
          </div>
        </div>
      </div>
    </div>
  );
}