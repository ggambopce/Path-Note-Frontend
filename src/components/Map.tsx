import { useEffect, useRef, useState } from 'react';
import MapPlaceInfo from './MapPlaceInfo';
import CoursePlaceItem from './CoursePlaceItem';
import CoursePlaceCreate, { type CourseCreatePayload } from './CoursePlaceCreate';
import type { CoursePlaceType } from '../types/CoursePlaceType';
import { useSearchStore } from '../stores/SearchStores';
import { createCourse } from '../apis/CreateCoursePlaceApi';
import { buildCourseCreateRequest } from '../utils/BuildCourseCreateRequest';

const accessToken = "<JWT토큰>"; 
const userId = "1";

type Poi = {
  id: string;
  name: string;             
  category?: string;
  tel?: string;
  address?: string;
  frontLat: number;
  frontLon: number;
  distance?: number;
};

interface MapProps {
  width: string;
  height: string;
}

const APP_KEY = import.meta.env.VITE_TMAP_APP_KEY as string;
console.log('[DEBUG] APP_KEY =', APP_KEY);
// 주변 POI 1건 조회
async function searchAroundPoi(
  lat: number,
  lng: number,
  radiusKm: number = 1,
  categories? : string,
  count = 1
): Promise<Poi | null> {
  const url = new URL('https://apis.openapi.sk.com/tmap/pois/search/around');
  url.searchParams.set('version', '1');
  url.searchParams.set('centerLat', String(lat));
  url.searchParams.set('centerLon', String(lng));
  const clampedRadius = radiusKm === 0 ? 0 : Math.min(33, Math.max(1, Math.floor(radiusKm)));
  url.searchParams.set('radius', String(clampedRadius));    // 0 또는 1~33
  url.searchParams.set('count', String(Math.min(150, Math.max(1, count))));

  if (categories && categories.trim()) {
    url.searchParams.set('categories', categories.trim());
  }

  console.log('[DEBUG] around URL:', url.toString());

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { Accept: 'application/json', appKey: APP_KEY },
  });
  if (!res.ok) throw new Error(`around POI 실패: ${res.status}`);

  const data = await res.json();
  const list = data?.searchPoiInfo?.pois?.poi;
  if (!Array.isArray(list) || list.length === 0) return null;

  const poi = list[0];
  return {
    id: poi?.id,
    name: poi?.name,
    category: poi?.upperBizName || poi?.middleBizName || poi?.lowerBizName,
    tel: poi?.telNo,
    address:
      poi?.newAddressList?.newAddress?.[0]?.fullAddressRoad ??
      [poi?.upperAddrName, poi?.middleAddrName, poi?.lowerAddrName, poi?.detailAddrName]
        .filter(Boolean)
        .join(' '),
    frontLat: Number(poi?.frontLat ?? poi?.noorLat ?? lat),
    frontLon: Number(poi?.frontLon ?? poi?.noorLon ?? lng),
    distance: poi?.radius ? Number(poi.radius) : undefined,
  };
}

const Map = ({
  width = '100%',
  height = '400px',
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const { Tmapv3 } = window as any;

  const [infoVisible, setInfoVisible] = useState(true);
  const [infoLat, setInfoLat] = useState<number | null>(null);
  const [infoLng, setInfoLng] = useState<number | null>(null);
  const [isCoursePanelOpen, setIsCoursePanelOpen] = useState(false);
  const [isCoursePlaceCreatePanelOpen, setIsCoursePlaceCreatePanelOpen] = useState(false);
  const [coursePlaces, setCoursePlaces] = useState<CoursePlaceType[]>([]);

  const selectedPOI = useSearchStore(s => s.selectedPOI);
  const idRef = useRef(1);
  
  //          effect: 지도 초기화          //
  useEffect(() => {
    if (!Tmapv3 || mapInstanceRef.current) return;

    const initializeMap = () => {
      try {
        const mapOptions = {
          center: new Tmapv3.LatLng(37.5652045, 126.98702028),
          width,
          height,
          zoom: 15,
        };

        const map = new Tmapv3.Map('map_div', mapOptions);
        mapInstanceRef.current = map;

        const AROUND_RADIUS = 50;

        //          event handler: 클릭 → 좌표 → 주변 1건 조회 → 콘솔 출력 이벤트 핸들러          //
        const handleClick = async () => {
          const ll = map.getCenter();
          const lat = typeof ll?.lat === 'function' ? ll.lat() : ll?.lat ?? ll?._lat;
          const lng = typeof ll?.lng === 'function' ? ll.lng() : ll?.lng ?? ll?._lng;
          if (lat == null || lng == null) return;

          console.log('클릭된 좌표 뽑기 성공', { lat, lng });

          setInfoLat(lat);
          setInfoLng(lng);
          setInfoVisible(true);

          const t0 = performance.now();
          try {
            const poi = await searchAroundPoi(lat, lng, AROUND_RADIUS);
            const took = Math.round(performance.now() - t0);

            if (!poi) {
              console.warn('[STEP2] no POI within', AROUND_RADIUS, 'm', `(took ${took}ms)`);
              return;
            }

            console.log(' 클릭시 반경 1km 가장 가까운 장소 객체 정보 수집', took, 'ms');
            console.table({
              id: poi.id,
              name: poi.name,
              category: poi.category ?? '',
              tel: poi.tel ?? '',
              address: poi.address ?? '',
              frontLat: poi.frontLat,
              frontLon: poi.frontLon,
              distance_m: poi.distance ?? '(unknown)',
            });
          } catch (e) {
            console.error('[STEP2] around search failed:', (e as Error).message);
          }
        };

        map.on('Click', handleClick);

        console.log('TMap 지도 초기화 완료');
      } catch (error) {
        console.error('TMap 지도 초기화 실패:', error);
      }
    };

    initializeMap();

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [Tmapv3, width, height]);

  //          effect: 선택된 POI가 바뀌면 지도 이동 + 줌 + 마커 갱신 + 콘솔          //
  useEffect(() => {
    if (!Tmapv3 || !mapInstanceRef.current || !selectedPOI) return;

    const map = mapInstanceRef.current;
    const pos = new Tmapv3.LatLng(selectedPOI.lat, selectedPOI.lng);

    // 중심 이동 & 적당한 줌
    map.setCenter(pos);
    if (typeof map.setZoom === 'function') map.setZoom(17);

    // 마커 없으면 생성, 있으면 위치만 갱신
    if (!markerRef.current) {
      markerRef.current = new Tmapv3.Marker({
        position: pos,
        map,
        title: selectedPOI.name,
      });
    } else {
      markerRef.current.setPosition(pos);
      markerRef.current.setMap(map);
    }

    console.log('[MAP] 선택된 장소로 이동 & 마커 표시', {
      id: selectedPOI.id,
      name: selectedPOI.name,
      address: selectedPOI.address,
      lat: selectedPOI.lat,
      lng: selectedPOI.lng,
    });
  }, [selectedPOI, Tmapv3]);

  //          event handler: 최종 코스 작성 패널 열기          //
  const handleOpenCoursePanel = () => {
    if (!selectedPOI) {
    console.warn('[COURSE] 선택된 검색 결과가 없습니다.');
    return; // null 가드로 타입 좁히기
  }
    setIsCoursePanelOpen(true);

    const id = idRef.current++;
    setCoursePlaces((prev) => [
      ...prev,
      {
        id,
        name: selectedPOI.name,
        address: selectedPOI.address,
        phone: `010-0000-00${String(id).padStart(2, '0')}`,
        lat: selectedPOI.lat,
        lng: selectedPOI.lng,
        arrivalTime: '',
        departureTime: '',
      },
    ]);
  };
  //          event handler: 시간 변경 핸들러          //
  const handlePlaceTimeChange = (
    id: number,
    t: { arrivalTime?: string; departureTime?: string }
  ) => {
    setCoursePlaces(prev =>
      prev.map(p => (p.id === id ? { ...p, ...t } : p))
    );
    console.log('[COURSE] time changed:', id, t);
  };

  //          event handler: 코스 작성 패널 닫기 핸들러          //
  const handleCloseCoursePlaceCreate = () => {
    setIsCoursePlaceCreatePanelOpen(false);
  };

  //          event handler: 장소 취소 핸들러          //
  const handleRemovePlace = (id: number) => {
    setCoursePlaces((prev) => prev.filter((p) => p.id !== id));
  };

  //          event handler: 코스 최종 등록 이벤트 핸들러          //
  const handleSubmitCourse = async (payload: CourseCreatePayload) => {
  const req = buildCourseCreateRequest(userId, payload, coursePlaces);
  const res = await createCourse(req, accessToken);
};

  //          render: 메인 맵 랜더링          //
  return (
    <div>
      <div
        id="map_div"
        ref={mapRef}
        style={{ width, height }}
        className="w-full h-full"
      />

      {/* 맵 장소 정보 */}
      <div className="absolute top-1/2 left-7/8 -translate-x-1/2 -translate-y-1/2">
        <MapPlaceInfo
          visible={infoVisible}
          lat={infoLat}
          lng={infoLng}
          poi={selectedPOI ? {
          name: selectedPOI.name,
          address: selectedPOI.address,
          } : null}
          onClose={() => setInfoVisible(false)}
          onOpenCoursePanel={handleOpenCoursePanel}
        />
      </div>

      {/* 코스 작성 */}
      {isCoursePlaceCreatePanelOpen && (
        <div className="absolute top-1/2 left-3/5 -translate-x-1/2 -translate-y-1/2">
          <CoursePlaceCreate onCancel={handleCloseCoursePlaceCreate} places={coursePlaces} onSubmit={handleSubmitCourse} />
        </div>
      )}

      {/* 코스 장소 리스트 */}
      {isCoursePanelOpen && (
        <aside className="absolute left-4 top-20 bottom-4 z-10 w-72 rounded-3xl bg-white/80 backdrop-blur shadow-xl ring-1 ring-black/10">
          <div className="flex h-full flex-col">
            <header className="flex items-center justify-between px-4 pt-4 pb-2">
              <h2 className="text-lg font-extrabold text-gray-800">장소 리스트</h2>
              <button
                type="button"
                onClick={() => setIsCoursePlaceCreatePanelOpen(true)}
                className="inline-flex items-center rounded-xl bg-main-200 px-3 py-1.5 text-white text-[13px] font-medium shadow-sm hover:bg-main-300 focus:outline-none focus:ring-2 focus:ring-main-200/40"
              >
                코스 등록
              </button>
              <button
                type="button"
                onClick={() => setIsCoursePanelOpen(false)}
                className="rounded-xl bg-main-200 px-3 py-1.5 text-white text-[13px]"
              >
                닫기
              </button>
            </header>

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
                  arrivalTime={p.arrivalTime}
                  departureTime={p.departureTime}
                  onTimeChange={handlePlaceTimeChange}
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
