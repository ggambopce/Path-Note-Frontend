import { useEffect, useRef } from 'react';
import MapPlaceInfo from './MapPlaceInfo';
import CoursePlaceItem from './CoursePlaceItem';
import CoursePlaceCreate from './CoursePlaceCreate';

interface MapProps {
  width: string;
  height: string;
}

const Map = ({
  width = '100%',
  height = '400px'
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const listenerRef = useRef<any>(null);
  const {Tmapv3} = window;

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

  return (
    <div>
      <div 
        id="map_div"
        ref={mapRef} 
        style={{ width: '100%', height: '400px' }}  // 지도 크기 설정
        className="w-full h-full"
      />

      {/* 맵 장소 정보 컴포넌트 추가 */}
      <div className="absolute top-1/2 left-7/8 -translate-x-1/2 -translate-y-1/2">
        <MapPlaceInfo />
      </div>

      <div className="absolute top-1/2 left-3/5 -translate-x-1/2 -translate-y-1/2">
        <CoursePlaceCreate />
      </div>

      {/* 코스 장소 아이템 컴포넌트 추가 */}
      <div className='absolute top-1/2 left-1/5 -translate-x-1/2 -translate-y-1/2'>
        <CoursePlaceItem />
        <CoursePlaceItem />
        <CoursePlaceItem />
        <CoursePlaceItem />     
        
      </div>
    </div>
  );
};

export default Map;