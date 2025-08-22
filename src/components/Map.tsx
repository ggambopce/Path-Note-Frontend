import { useEffect, useRef, useState } from 'react';
import MapPlaceInfo from './MapPlaceInfo';
import CoursePlaceItem from './CoursePlaceItem';
import CoursePlaceCreate from './CoursePlaceCreate';

interface MapProps {
  width: string;
  height: string;
}

interface PlaceListProps {
  places: {
    id: number;
    name: string;
    address: string;
    phone: string;
    lat: number;
    lng: number;
  }[];
  onClose: () => void;
  onOpenCoursePlacePanel?: () => void;
}

const Map = ({
  width = '100%',
  height = '400px'
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const listenerRef = useRef<any>(null);
  const {Tmapv3} = window;

  const [infoVisible, setInfoVisible] = useState(true);
  const [infoLat, setInfoLat] = useState<number | null>(null);
  const [infoLng, setInfoLng] = useState<number | null>(null);
  const [isCoursePanelOpen, setIsCoursePanelOpen] = useState(false);
  const [isCoursePlaceCreatePanelOpen, setIsCoursePlaceCreatePanelOpen] = useState(false);

  // 지도 초기화
  useEffect(() => {
    if (!Tmapv3 || mapInstanceRef.current) return;

    const initializeMap = () => {
      try {
        const mapOptions = {
          center: new Tmapv3.LatLng(37.56520450, 126.98702028),  // 서울의 위도, 경도
          width: width,  // 지도 너비
          height: height,  // 지도 높이
          zoom: 15  // 초기 줌 레벨
        };

        const map = new Tmapv3.Map('map_div', mapOptions);
        mapInstanceRef.current = map;

        // 클릭 좌표 콘솔 출력
        const handleClick = (e: any) => {
          console.log('Map clicked:', e);
          const ll = e?.latLng;
          const lat = typeof ll?.lat === 'function' ? ll.lat() : ll?.lat ?? ll?._lat;
          const lng = typeof ll?.lng === 'function' ? ll.lng() : ll?.lng ?? ll?._lng;
          if (lat == null || lng == null) return;
          console.log('clicked:', { lat, lng });

          if (lat == null || lng == null) return;
          setInfoLat(lat);
          setInfoLng(lng);
          setInfoVisible(true);
        };
        mapInstanceRef.current.on('Click', () => console.log('Map clicked'));
        listenerRef.current = map.on('Click', handleClick);
        

        console.log('TMap 지도 초기화 완료');
      } catch (error) {
        console.error('TMap 지도 초기화 실패:', error);
      }
    };


    initializeMap();

    return () => {
      if (listenerRef.current?.remove) listenerRef.current.remove();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  },[Tmapv3]);

  const handleOpenCoursePanel = () => {
    setIsCoursePanelOpen(true);
  };

  // 취소 시 호출될 핸들러
  const handleCloseCoursePlaceCreate = () => {
    setIsCoursePlaceCreatePanelOpen(false);
  };
  

  //          render: 메인 맵 컴포넌트 랜더링          //
  return (
    <div>
      <div 
        id="map_div"
        ref={mapRef} 
        style={{ width: '100%', height: '400px' }}  // 지도 크기 설정
        className="w-full h-full"
      />

      {/* 맵 장소 정보 컴포넌트 */}
      <div className="absolute top-1/2 left-7/8 -translate-x-1/2 -translate-y-1/2">
        <MapPlaceInfo
          visible={infoVisible}
          lat={infoLat}
          lng={infoLng}
          onClose={() => setInfoVisible(false)}
          onOpenCoursePanel={handleOpenCoursePanel}
        />
      </div>

      {/* 코스 작성 컴포넌트 */}
      {isCoursePlaceCreatePanelOpen && (
        <div className="absolute top-1/2 left-3/5 -translate-x-1/2 -translate-y-1/2">
          <CoursePlaceCreate onCancel={handleCloseCoursePlaceCreate} />
        </div>
      )}

      {/* 코스 장소 아이템 컴포넌트 추가 */}
      {isCoursePanelOpen && (
      <aside className="absolute left-4 top-20 bottom-4 z-10 w-72 rounded-3xl bg-white/80 backdrop-blur shadow-xl ring-1 ring-black/10">
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between px-4 pt-4 pb-2">
            <h2 className="text-lg font-extrabold text-gray-800">장소 리스트</h2>
            <button
            type="button"
            onClick={() => setIsCoursePlaceCreatePanelOpen(true)}
            className="inline-flex items-center rounded-xl bg-main-200 px-3 py-1.5 
                        text-white text-[13px] font-medium shadow-sm 
                        hover:bg-main-300 focus:outline-none focus:ring-2 
                        focus:ring-main-200/40"
            >
            코스 등록
            </button>
            <button
            type="button"
            onClick={() => setIsCoursePanelOpen(false)}
            className="rounded-xl rounded-xl bg-main-200 px-3 py-1.5 
                        text-white text-[13px]"
          >
            닫기
          </button>
          </header>

          {/* 스크롤 영역 */}
          <div className="mt-2 h-px w-full bg-black/5" />
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            <CoursePlaceItem />
          </div>
        </div>
      </aside>
      )}
    </div>
  );
};

export default Map;