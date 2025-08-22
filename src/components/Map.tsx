  import { useEffect, useRef, useState } from 'react';
  import MapPlaceInfo from './MapPlaceInfo';
  import CoursePlaceItem from './CoursePlaceItem';
  import CoursePlaceCreate from './CoursePlaceCreate';
  import type { CoursePlaceType } from '../types/CoursePlaceType';
  import { createRoot } from 'react-dom/client';

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
    const {Tmapv3} = window;

    const infoWindowRef = useRef<any>(null);
    const popupRootRef = useRef<ReturnType<typeof createRoot> | null>(null);
  
    const [infoVisible, setInfoVisible] = useState(true);
    const [infoLat, setInfoLat] = useState<number | null>(null);
    const [infoLng, setInfoLng] = useState<number | null>(null);
    const [isCoursePanelOpen, setIsCoursePanelOpen] = useState(false);
    const [isCoursePlaceCreatePanelOpen, setIsCoursePlaceCreatePanelOpen] = useState(false);
    const [coursePlaces, setCoursePlaces] = useState<CoursePlaceType[]>([]);
    
    const idRef = useRef(1);

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

          map.on('Click', ()=>{
              const ll = map.getCenter();
              const lat = typeof ll?.lat === 'function' ? ll.lat() : ll?.lat ?? ll?._lat;
              const lng = typeof ll?.lng === 'function' ? ll.lng() : ll?.lng ?? ll?._lng;
              if (lat == null || lng == null) return;
              
              console.log('clicked:', { lat, lng });

              new Tmapv3.InfoWindow({
                position: new Tmapv3.LatLng(lat, lng),
                content: `
                  <div style="position: static; display: flex; flex-direction: column; font-size: 14px;
                  box-shadow: 5px 5px 5px #00000040; border-radius: 10px; width: 250px; background: #fff;">
        <div class='img-box'
             style="position: relative; width: 100%; height: 150px; border-radius: 10px 10px 0 0;
                    background: #f5f5f5 url(resources/images/sample/img-skt.png) no-repeat center;">
        </div>
        <div class='info-box' style="padding: 10px;">
          <p style="margin-bottom: 7px; overflow: hidden;">
            <span class='tit' style="font-size: 16px; font-weight: bold;">티맵 모빌리티</span>
            <a href='/' target='_blank' class='link'
               style="color: #3D6DCC; font-size: 13px; float: right;">홈페이지</a>
          </p>
          <ul class='ul-info'>
            <li class='li-addr'
                style="padding-left: 20px; margin-bottom: 5px;
                       background: url(resources/images/sample/ico-map.svg) no-repeat top 3px left;">
              <p class='new-addr'>서울 중구 삼일대로 343 (우)04538</p>
              <p class='old-addr' style="color: #707070;">(지번) 저동1가 114</p>
            </li>
            <li class='li-tell'
                style="padding-left: 20px;
                       background: url(resources/images/sample/ico-tell.svg) no-repeat top 4px left;">
              <span class='tell'>1588-8787</span>
            </li>
          </ul>
        </div>
        <div>위도: ${lat}</div> 
        <div>경도: ${lng}</div>
        <a href='javascript:void(0)' onclick='onClose()' class='btn-close'
           style="position: absolute; top: 10px; right: 10px; display: block; width: 15px; height: 15px;
                  background: url(resources/images/sample/btn-close-w.svg) no-repeat center;">
        </a>
      </div>
                `,
            type: 2,
            map: mapInstanceRef.current, // 혹은 effect 내부면 지역변수 map
          });
              return  
            });

          

          console.log('TMap 지도 초기화 완료');
        } catch (error) {
          console.error('TMap 지도 초기화 실패:', error);
        }
      };

      


      initializeMap();

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy();
          mapInstanceRef.current = null;
        }
      };
    },[Tmapv3]);

    //코스 패널 열기 핸들러
    const handleOpenCoursePanel = () => {
      setIsCoursePanelOpen(true);

      const id = idRef.current++;
      setCoursePlaces(prev => [
        ...prev,
        {
          id,
          name: `장소 ${id}`,
          address: `주소 예시 ${id}`,
          phone: `010-0000-00${String(id).padStart(2, '0')}`,
          lat: infoLat ?? undefined,
          lng: infoLng ?? undefined,
        },
      ]);
    };

    // 취소 시 호출될 핸들러
    const handleCloseCoursePlaceCreate = () => {
      setIsCoursePlaceCreatePanelOpen(false);
    };
    
    // 장소 삭제 핸들러
    const handleRemovePlace = (id: number) => {
      setCoursePlaces(prev => prev.filter(p => p.id !== id));
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
            <CoursePlaceCreate 
              onCancel={handleCloseCoursePlaceCreate}
              places={coursePlaces}
            />
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
              {coursePlaces.map((p, idx) => (
              <CoursePlaceItem
                key={p.id}
                id={p.id}
                index={idx + 1}
                name={p.name}
                address={p.address}
                phone={p.phone}
                onRemove={handleRemovePlace}
              />
              ))}
            </div>
          </div>
        </aside>
        )}
      </div>
    );
  };

  export default Map;