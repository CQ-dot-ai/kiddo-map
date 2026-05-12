import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { motion } from 'framer-motion';
import { PLACES } from '../data/places';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function KiddoMap({ places, selectedPlace, onPinClick }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 初始化地图
  useEffect(() => {
    if (map.current) return; // 只初始化一次

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      // 使用柔和的浅色样式，配合童趣风格
      style: 'mapbox://styles/mapbox/light-v11',
      center: [101.6869, 3.139], // KL 中心
      zoom: 11.2,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
    });

    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      'bottom-right'
    );

    map.current.addControl(
      new mapboxgl.NavigationControl({
        showCompass: false,
        visualizePitch: false,
      }),
      'bottom-right'
    );

    map.current.on('load', () => {
      if (!map.current) return;

      setMapLoaded(true);
      
      // 自定义地图样式 - 童趣糖果色
      try {
        map.current.setPaintProperty('water', 'fill-color', '#B3E0FF');
        map.current.setPaintProperty('land', 'background-color', '#FFF8E7');
      } catch (error) {
        console.warn('Map style update skipped:', error?.message || error);
      }
      
      // 调整道路颜色
      const layers = map.current.getStyle()?.layers || [];
      layers.forEach(layer => {
        if (layer.id.includes('road') && layer.type === 'line') {
          try {
            map.current.setPaintProperty(layer.id, 'line-color', '#FFFFFF');
          } catch (e) {}
        }
        if (layer.id.includes('park') || layer.id.includes('grass')) {
          try {
            map.current.setPaintProperty(layer.id, 'fill-color', '#D4F1D4');
          } catch (e) {}
        }
      });
    });

    return () => {
      if (map.current) {
        try {
          map.current.remove();
        } catch (error) {
          // Mapbox can abort pending tile requests during React refresh/unmount.
          console.warn('Map cleanup skipped:', error?.message || error);
        }
        map.current = null;
      }
    };
  }, []);

  // 添加图钉
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // 清除旧的图钉
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // 添加新图钉
    places.forEach((place) => {
      // 创建自定义图钉元素 - Lego 风格
      const el = document.createElement('div');
      el.className = 'kiddo-pin';
      el.style.cssText = `
        cursor: pointer;
        transform-origin: bottom center;
      `;

      el.innerHTML = `
        <div class="kiddo-pin-inner" style="
          position: relative;
          width: 56px;
          height: 64px;
          filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.2));
          transform-origin: bottom center;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation: float 3s ease-in-out infinite;
          animation-delay: ${Math.random() * 2}s;
        ">
          <!-- 图钉底部圆形 -->
          <div style="
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 8px;
            height: 8px;
            background: rgba(0,0,0,0.2);
            border-radius: 50%;
            filter: blur(2px);
          "></div>
          
          <!-- 图钉主体 -->
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, ${place.color.primary}, ${place.color.dark});
            border-radius: 50% 50% 50% 8px;
            transform: rotate(-45deg);
            box-shadow: 
              inset 2px 2px 6px rgba(255, 255, 255, 0.4),
              inset -2px -2px 6px rgba(0, 0, 0, 0.15);
            border: 3px solid white;
          "></div>
          
          <!-- emoji icon -->
          <div style="
            position: absolute;
            top: 8px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
          ">
            ${place.emoji}
          </div>
        </div>
      `;

      // 点击事件
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const inner = el.querySelector('.kiddo-pin-inner');
        // 弹跳动画
        inner.style.transform = 'scale(1.2)';
        setTimeout(() => {
          inner.style.transform = 'scale(1)';
        }, 200);
        
        // 飞到地点
        map.current.flyTo({
          center: place.coordinates,
          zoom: 14,
          duration: 1000,
          essential: true,
        });
        
        onPinClick(place);
      });

      el.addEventListener('mouseenter', () => {
        el.querySelector('.kiddo-pin-inner').style.transform = 'scale(1.15)';
      });
      el.addEventListener('mouseleave', () => {
        el.querySelector('.kiddo-pin-inner').style.transform = 'scale(1)';
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(place.coordinates)
        .addTo(map.current);

      markers.current.push(marker);
    });

    // 如果有地点，自动调整视野
    if (places.length > 0 && places.length < PLACES.length) {
      const bounds = new mapboxgl.LngLatBounds();
      places.forEach(p => bounds.extend(p.coordinates));
      map.current.fitBounds(bounds, { padding: 100, duration: 800 });
    }
  }, [mapLoaded, places, onPinClick]);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#FFF8E7' }}>
      <div
        ref={mapContainer}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#FFF8E7',
        }}
      />

      {!mapLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            pointerEvents: 'none',
            background: 'linear-gradient(180deg, rgba(255,248,231,0.96), rgba(255,248,231,0.68))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div style={{
            background: 'rgba(255,255,255,0.94)',
            borderRadius: '22px',
            padding: '16px 18px',
            boxShadow: '0 14px 40px rgba(0,0,0,0.12)',
            textAlign: 'center',
            color: 'var(--charcoal)',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 800,
          }}>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: '34px', marginBottom: '6px' }}
            >
              🗺️
            </motion.div>
            Finding kid-friendly spots...
          </div>
        </motion.div>
      )}
    </div>
  );
}
