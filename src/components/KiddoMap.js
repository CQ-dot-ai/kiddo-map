import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { motion } from 'framer-motion';
import { PLACES } from '../data/places';
import { MAPBOX_TOKEN } from '../lib/site';

mapboxgl.accessToken = MAPBOX_TOKEN;

export default function KiddoMap({ places, selectedPlace, onPinClick }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (map.current || mapError) return;

    if (!MAPBOX_TOKEN) {
      setMapError(true);
      return;
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [101.6869, 3.139],
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

        try {
          map.current.setPaintProperty('water', 'fill-color', '#B3E0FF');
          map.current.setPaintProperty('land', 'background-color', '#FFF8E7');
        } catch (error) {
          console.warn('Map style update skipped:', error?.message || error);
        }

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

      map.current.on('error', (error) => {
        console.warn('Mapbox error:', error?.error || error);
        setMapError(true);
      });
    } catch (error) {
      console.warn('Map init skipped:', error?.message || error);
      setMapError(true);
      if (map.current) {
        try {
          map.current.remove();
        } catch {}
        map.current = null;
      }
    }

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
  }, [mapError]);

  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    places.forEach((place) => {
      const el = document.createElement('div');
      el.className = 'kiddo-pin';
      el.style.cursor = 'pointer';
      el.style.transformOrigin = 'bottom center';

      const inner = document.createElement('div');
      inner.className = 'kiddo-pin-inner';
      Object.assign(inner.style, {
        position: 'relative',
        width: '56px',
        height: '64px',
        filter: 'drop-shadow(0 6px 8px rgba(0, 0, 0, 0.2))',
        transformOrigin: 'bottom center',
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        animation: 'float 3s ease-in-out infinite',
        animationDelay: `${Math.random() * 2}s`,
      });

      const shadow = document.createElement('div');
      Object.assign(shadow.style, {
        position: 'absolute',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '8px',
        height: '8px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '50%',
        filter: 'blur(2px)',
      });

      const body = document.createElement('div');
      Object.assign(body.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '56px',
        height: '56px',
        background: `linear-gradient(135deg, ${place.color.primary}, ${place.color.dark})`,
        borderRadius: '50% 50% 50% 8px',
        transform: 'rotate(-45deg)',
        boxShadow: 'inset 2px 2px 6px rgba(255,255,255,0.4), inset -2px -2px 6px rgba(0,0,0,0.15)',
        border: '3px solid white',
      });

      const icon = document.createElement('div');
      Object.assign(icon.style, {
        position: 'absolute',
        top: '8px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
      });
      icon.textContent = place.emoji;

      inner.appendChild(shadow);
      inner.appendChild(body);
      inner.appendChild(icon);
      el.appendChild(inner);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const inner = el.querySelector('.kiddo-pin-inner');
        inner.style.transform = 'scale(1.2)';
        setTimeout(() => {
          inner.style.transform = 'scale(1)';
        }, 200);
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

    // Adjust viewport to show the pins
    if (places.length === 1) {
      map.current.flyTo({ center: places[0].coordinates, zoom: 14, duration: 800 });
    } else if (places.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      places.forEach(p => bounds.extend(p.coordinates));
      map.current.fitBounds(bounds, { padding: 100, maxZoom: 14.5, duration: 800 });
    }
  }, [mapLoaded, places, onPinClick]);

  useEffect(() => {
    if (!mapLoaded || !map.current || !selectedPlace) return;
    map.current.flyTo({
      center: selectedPlace.coordinates,
      zoom: 14.5,
      duration: 900,
      essential: true,
    });
  }, [mapLoaded, selectedPlace]);

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

      {(mapError || !mapLoaded) && (
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
            maxWidth: '260px',
          }}>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: '34px', marginBottom: '6px' }}
            >
              🗺️
            </motion.div>
            {mapError ? 'Map is taking a break.' : 'Finding kid-friendly spots...'}
            <div style={{ marginTop: '6px', fontSize: '12px', color: '#777', fontWeight: 700, lineHeight: 1.4 }}>
              {mapError
                ? 'The picks still work. Refresh later or use the list.'
                : 'The picks still work while the map loads.'}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
