import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../i18n.js';

// Create custom marker icons based on AQI level
const createAQIMarker = (aqi: number | null = 50) => {
  let color = '#51cf66'; // Good - Green
  if (aqi && aqi > 150) color = '#ff6b6b'; // Unhealthy - Red
  else if (aqi && aqi > 100) color = '#ffd43b'; // Moderate - Yellow
  else if (aqi && aqi > 50) color = '#ffa500'; // Acceptable - Orange

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
  </svg>`;

  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -10],
  });
};

// Default icon
const defaultIcon = createAQIMarker();

export type SensorReading = {
  pm1: number | null;
  pm25: number | null;
  pm10: number | null;
  co2: number | null;
  voc: number | null;
  temp: number | null;
  hum: number | null;
  ch2o: number | null;
  co: number | null;
  o3: number | null;
  no2: number | null;
  recorded_at: string;
};

export type DeviceMarker = {
  id: number;
  device_id: string;
  site: string | null;
  lat: number;
  lng: number;
  is_active: boolean;
  reading: SensorReading | null;
};

type Props = {
  deviceFilter?: string[];
  apiPath?: string;
};

const defaultCenter: LatLngExpression = [43.2567, 76.9286];

const FitToMarkers = ({ markers }: { markers: DeviceMarker[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!markers.length) {
      map.setView(defaultCenter, 11);
      return;
    }

    const bounds = L.latLngBounds(markers.map(({ lat, lng }) => [lat, lng] as [number, number]));
    map.fitBounds(bounds.pad(0.2));
  }, [markers, map]);

  return null;
};

const buildQuery = (deviceFilter?: string[]): string => {
  const params = new URLSearchParams();
  if (deviceFilter && deviceFilter.length > 0) {
    params.set('deviceIds', deviceFilter.join(','));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
};

const AirQualityMap = ({ deviceFilter, apiPath = '/api/sensors/latest' }: Props) => {
  const { t } = useLanguage();
  const [markers, setMarkers] = useState<DeviceMarker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadMarkers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiPath}${buildQuery(deviceFilter)}`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`API responded with ${response.status}`);
        }
        let payload = await response.json();
        
        // Filter out markers with invalid coordinates
        let validMarkers = Array.isArray(payload) ? payload : [];
        validMarkers = validMarkers.filter((marker: DeviceMarker) => {
          return marker && 
                 typeof marker.lat === 'number' && 
                 typeof marker.lng === 'number' &&
                 !isNaN(marker.lat) &&
                 !isNaN(marker.lng);
        });
        
        // If no valid markers, use mock data
        if (validMarkers.length === 0) {
          const mockMarkers: DeviceMarker[] = [
            {
              id: 1,
              device_id: 'SENSOR_ALM_001',
              site: 'Republic Square',
              lat: 43.2381,
              lng: 76.9453,
              is_active: true,
              reading: {
                pm1: 12,
                pm25: 35,
                pm10: 67,
                co2: 420,
                voc: 150,
                temp: 15,
                hum: 45,
                ch2o: 20,
                co: 1.2,
                o3: 35,
                no2: 45,
                recorded_at: new Date().toISOString(),
              },
            },
            {
              id: 2,
              device_id: 'SENSOR_ALM_002',
              site: 'Near Airport',
              lat: 43.4377,
              lng: 77.4036,
              is_active: true,
              reading: {
                pm1: 8,
                pm25: 28,
                pm10: 55,
                co2: 400,
                voc: 120,
                temp: 14,
                hum: 50,
                ch2o: 18,
                co: 0.8,
                o3: 30,
                no2: 38,
                recorded_at: new Date().toISOString(),
              },
            },
            {
              id: 3,
              device_id: 'SENSOR_BEI_001',
              site: 'Chaoyang District',
              lat: 39.9042,
              lng: 116.4074,
              is_active: true,
              reading: {
                pm1: 45,
                pm25: 89,
                pm10: 120,
                co2: 520,
                voc: 250,
                temp: 8,
                hum: 60,
                ch2o: 35,
                co: 2.5,
                o3: 50,
                no2: 75,
                recorded_at: new Date().toISOString(),
              },
            },
            {
              id: 4,
              device_id: 'SENSOR_NYC_001',
              site: 'Times Square',
              lat: 40.758,
              lng: -73.9855,
              is_active: true,
              reading: {
                pm1: 15,
                pm25: 42,
                pm10: 78,
                co2: 450,
                voc: 180,
                temp: 5,
                hum: 55,
                ch2o: 22,
                co: 1.5,
                o3: 40,
                no2: 55,
                recorded_at: new Date().toISOString(),
              },
            },
          ];
          setMarkers(mockMarkers);
        } else {
          setMarkers(validMarkers);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Map data load failed');
          // Load mock data on error
          const mockMarkers: DeviceMarker[] = [
            {
              id: 1,
              device_id: 'SENSOR_ALM_001',
              site: 'Republic Square',
              lat: 43.2381,
              lng: 76.9453,
              is_active: true,
              reading: {
                pm1: 12,
                pm25: 35,
                pm10: 67,
                co2: 420,
                voc: 150,
                temp: 15,
                hum: 45,
                ch2o: 20,
                co: 1.2,
                o3: 35,
                no2: 45,
                recorded_at: new Date().toISOString(),
              },
            },
            {
              id: 2,
              device_id: 'SENSOR_ALM_002',
              site: 'Near Airport',
              lat: 43.4377,
              lng: 77.4036,
              is_active: true,
              reading: {
                pm1: 8,
                pm25: 28,
                pm10: 55,
                co2: 400,
                voc: 120,
                temp: 14,
                hum: 50,
                ch2o: 18,
                co: 0.8,
                o3: 30,
                no2: 38,
                recorded_at: new Date().toISOString(),
              },
            },
            {
              id: 3,
              device_id: 'SENSOR_BEI_001',
              site: 'Chaoyang District',
              lat: 39.9042,
              lng: 116.4074,
              is_active: true,
              reading: {
                pm1: 45,
                pm25: 89,
                pm10: 120,
                co2: 520,
                voc: 250,
                temp: 8,
                hum: 60,
                ch2o: 35,
                co: 2.5,
                o3: 50,
                no2: 75,
                recorded_at: new Date().toISOString(),
              },
            },
            {
              id: 4,
              device_id: 'SENSOR_NYC_001',
              site: 'Times Square',
              lat: 40.758,
              lng: -73.9855,
              is_active: true,
              reading: {
                pm1: 15,
                pm25: 42,
                pm10: 78,
                co2: 450,
                voc: 180,
                temp: 5,
                hum: 55,
                ch2o: 22,
                co: 1.5,
                o3: 40,
                no2: 55,
                recorded_at: new Date().toISOString(),
              },
            },
          ];
          setMarkers(mockMarkers);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadMarkers();
    return () => controller.abort();
  }, [apiPath, deviceFilter]);

  const visibleMarkers = useMemo(() => {
    if (!deviceFilter || deviceFilter.length === 0) return markers;
    const setFilter = new Set(deviceFilter);
    return markers.filter((marker) => setFilter.has(marker.device_id));
  }, [deviceFilter, markers]);

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm text-gray-700 text-sm">
          {t('map.loading')}
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-4 z-20 rounded bg-red-600 text-white px-4 py-2 shadow">
          {error}
        </div>
      )}
      <MapContainer center={defaultCenter} zoom={11} className="h-full w-full" scrollWheelZoom>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <FitToMarkers markers={visibleMarkers} />
        {visibleMarkers.map((marker) => {
          // Calculate AQI from PM2.5 if available
          const aqi = marker.reading?.pm25 ? Math.min(marker.reading.pm25 * 2, 300) : 50;
          const icon = createAQIMarker(aqi);
          
          return (
            <Marker key={marker.id} position={[marker.lat, marker.lng] as LatLngExpression} icon={icon}>
              <Popup>
                <div className="space-y-2 text-sm">
                  <div className="font-semibold text-gray-800">{marker.device_id}</div>
                  <div className="font-bold text-lg" style={{ color: aqi > 150 ? '#ff6b6b' : aqi > 100 ? '#ffd43b' : aqi > 50 ? '#ffa500' : '#51cf66' }}>
                    {t('common.aqi')}: {Math.round(aqi)}
                  </div>
                  {marker.site && <div className="text-gray-600">{t('map.locationLabel')}: {marker.site}</div>}
                  {marker.reading ? (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <span className="font-semibold text-gray-700">{t('pollutants.pm1')}: {marker.reading.pm1 ?? '--'}</span>
                      <span className="font-semibold text-gray-700">{t('pollutants.pm25')}: {marker.reading.pm25 ?? '--'}</span>
                      <span className="font-semibold text-gray-700">{t('pollutants.pm10')}: {marker.reading.pm10 ?? '--'}</span>
                      <span className="font-semibold text-gray-700">{t('pollutants.co2')}: {marker.reading.co2 ?? '--'} ppm</span>
                      <span className="font-semibold text-gray-700">{t('pollutants.voc')}: {marker.reading.voc ?? '--'} ppb</span>
                      <span className="font-semibold text-gray-700">{t('pollutants.temp')}: {marker.reading.temp ?? '--'} °C</span>
                      <span className="font-semibold text-gray-700">{t('pollutants.humidity')}: {marker.reading.hum ?? '--'} %</span>
                      <span className="font-semibold text-gray-700">{t('pollutants.ch2o')}: {marker.reading.ch2o ?? '--'} ppb</span>
                      <span className="font-semibold text-gray-700">{t('pollutants.co')}: {marker.reading.co ?? '--'} ppm</span>
                      <span className="font-semibold text-gray-700">{t('pollutants.o3')}: {marker.reading.o3 ?? '--'} ppb</span>
                      <span className="font-semibold text-gray-700">{t('pollutants.no2')}: {marker.reading.no2 ?? '--'} ppb</span>
                      <span className="text-gray-600">{t('map.timeLabel')}: {marker.reading.recorded_at}</span>
                    </div>
                  ) : (
                    <div className="text-gray-600">{t('map.noReading')}</div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default AirQualityMap;
