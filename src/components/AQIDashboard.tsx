/**
 * Air Quality Dashboard
 * Main dashboard component with real-time AQI, charts, alerts, and forecasts
 */

import React, { useState, useEffect, useRef } from 'react';
import { FiAlertTriangle, FiTrendingUp, FiMapPin, FiRefreshCw } from 'react-icons/fi';
import AKIReview from './AKIReview';
import WeeklyTrends from './WeeklyTrends';
import ForecastChart from './ForecastChart';
import KeyTermsExplanation from './KeyTermsExplanation';
import MainCausesOfDirtyAir from './MainCausesOfDirtyAir';
import AirQualityImprovementRecommendations from './AirQualityImprovementRecommendations';
import LocationSelector from './LocationSelector';
import { useLanguage } from '../i18n.js';

interface AQIData {
  sensor_id: number;
  device_id: string;
  site?: string;
  sensor_name?: string;
  location?: { lat: number; lng: number };
  latitude?: number;
  longitude?: number;
  current_aqi?: number;
  aqi_overall?: number;
  dominant_pollutant: string;
  aqi_category?: string;
  health_implication?: string;
  aqi_color?: string;
  color_code?: string;
  pollutants?: {
    pm25: number | null;
    pm10: number | null;
    no2: number | null;
    co: number | null;
    o3: number | null;
  };
  pm25_aqi?: number;
  pm10_aqi?: number;
  no2_aqi?: number;
  co_aqi?: number;
  o3_aqi?: number;
  timestamp: string;
}

interface Alert {
  id: number;
  sensor_id: number;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  created_at: string;
  is_active: boolean;
}

interface Forecast {
  hour: number;
  predicted_aqi: number;
  confidence: number;
  valid_at: string;
}

interface AQIDashboardProps {
  selectedLocationIds?: number[];
  onLocationChange?: (ids: number[]) => void;
}

const AQIDashboard: React.FC<AQIDashboardProps> = ({ 
  selectedLocationIds: propLocationIds,
  onLocationChange 
}) => {
  const { t, locale } = useLanguage();
  const localeMap: Record<string, string> = { en: 'en-US', kk: 'kk-KZ', ru: 'ru-RU' };
  const resolvedLocale = localeMap[locale] || 'en-US';
  // Initialize from localStorage or use defaults
  const getInitialLocations = () => {
    try {
      const saved = localStorage.getItem('selectedLocationIds');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved locations:', e);
    }
    return [1, 2]; // Defaults to Almaty locations
  };

  const [aqiData, setAqiData] = useState<AQIData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<number | null>(1); // Default to first sensor
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [selectedLocationIds, setSelectedLocationIds] = useState<number[]>(getInitialLocations);
  const [availableLocations, setAvailableLocations] = useState<any[]>([]);
  const selectedLocationIdsRef = useRef<number[]>(getInitialLocations());

  const reconcileSelectedLocations = (locations: { id: number }[]) => {
    if (!locations.length) return;

    const validIds = new Set(locations.map((loc) => loc.id));
    const filtered = selectedLocationIdsRef.current.filter((id) => validIds.has(id));
    const nextSelection = filtered.length ? filtered : locations.slice(0, 2).map((loc) => loc.id);

    if (nextSelection.join(',') !== selectedLocationIdsRef.current.join(',')) {
      setSelectedLocationIds(nextSelection);
      selectedLocationIdsRef.current = nextSelection;
      localStorage.setItem('selectedLocationIds', JSON.stringify(nextSelection));
      if (onLocationChange) {
        onLocationChange(nextSelection);
      }
    }
  };

  // Save selected locations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('selectedLocationIds', JSON.stringify(selectedLocationIds));
    selectedLocationIdsRef.current = selectedLocationIds;
  }, [selectedLocationIds]);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/sensors');
      if (!response.ok) throw new Error('Failed to fetch sensors');
      const data: any[] = await response.json();

      const locations = data.map((item) => ({
        id: item.id,
        name: item.name || item.location_name || `Sensor ${item.id}`,
        city: item.city || 'Unknown',
        country: item.country || 'Unknown',
        location_name: item.location_name,
      }));

      setAvailableLocations(locations);
      reconcileSelectedLocations(locations);
    } catch (err) {
      console.error('Error fetching sensors:', err);
    }
  };

  // Fetch current AQI data
  const fetchAQIData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/aqi/current');
      if (!response.ok) throw new Error('Failed to fetch AQI data');
      const data = (await response.json()) as any[];
      
      // Build available locations from response - do this every time to get all locations
      if (data.length > 0) {
        const uniqueLocations = Array.from(
          new Map(
            data.map((item) => [
              item.sensor_id,
              {
                id: item.sensor_id,
                name: item.site || item.sensor_name || item.location_name || `Sensor ${item.sensor_id}`,
                city: item.city || 'Unknown',
                country: item.country || 'Unknown',
                location_name: item.location_name,
              },
            ])
          ).values()
        );
        setAvailableLocations(uniqueLocations);
      }

      // Filter data by currently selected locations (using ref to get latest value)
      const filteredData = data.filter((item) => selectedLocationIdsRef.current.includes(item.sensor_id));
      
      // De-duplicate by sensor_id (keep latest timestamp if duplicates exist)
      const dedupedData = Array.from(
        filteredData.reduce((map: Map<number, any>, item: any) => {
          const existing = map.get(item.sensor_id);
          if (!existing) {
            map.set(item.sensor_id, item);
            return map;
          }

          const existingTime = existing.timestamp ? new Date(existing.timestamp).getTime() : 0;
          const currentTime = item.timestamp ? new Date(item.timestamp).getTime() : 0;
          if (currentTime >= existingTime) {
            map.set(item.sensor_id, item);
          }
          return map;
        }, new Map<number, any>())
      ).map((entry) => (entry as [number, any])[1]);

      // Normalize the data to match AQIData interface
      const normalizedData = dedupedData.map((item: any) => ({
        sensor_id: item.sensor_id,
        device_id: item.device_id || item.sensor_id,
        site: item.site || item.sensor_name || item.location_name || `Sensor ${item.sensor_id}`,
        location: item.location || { lat: item.latitude || 0, lng: item.longitude || 0 },
        current_aqi: typeof item.current_aqi === 'number'
          ? item.current_aqi
          : typeof item.aqi_overall === 'number'
            ? item.aqi_overall
            : 0,
        dominant_pollutant: item.dominant_pollutant || 'PM2.5',
        aqi_category: item.aqi_category || item.health_implication || 'Moderate',
        aqi_color: item.aqi_color || item.color_code || '#FFA500',
        pollutants: item.pollutants || {
          pm25: item.pm25_aqi || null,
          pm10: item.pm10_aqi || null,
          no2: item.no2_aqi || null,
          co: item.co_aqi || null,
          o3: item.o3_aqi || null,
        },
        timestamp: item.timestamp || new Date().toISOString(),
      }));
      
      setAqiData(normalizedData);
      setLastUpdate(new Date());
      if (normalizedData.length > 0 && !selectedSensor) {
        setSelectedSensor(normalizedData[0].sensor_id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching AQI data');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch active alerts
  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/alerts/active');
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const data = await response.json();
      setAlerts(data.alerts);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  // Fetch forecast for selected sensor
  const fetchForecast = async () => {
    if (!selectedSensor) return;
    try {
      const response = await fetch(`/api/forecast/${selectedSensor}`);
      if (!response.ok) throw new Error('Failed to fetch forecast');
      const data = await response.json();
      setForecast(data.forecasts || []);
    } catch (err) {
      console.error('Error fetching forecast:', err);
    }
  };

  useEffect(() => {
    if (propLocationIds && propLocationIds.length > 0) {
      setSelectedLocationIds(propLocationIds);
      selectedLocationIdsRef.current = propLocationIds;
    }
  }, [propLocationIds]);

  useEffect(() => {
    if (availableLocations.length) {
      reconcileSelectedLocations(availableLocations);
    }
  }, [availableLocations]);

  // Initial load and setup polling
  useEffect(() => {
    fetchLocations();
    fetchAQIData();
    fetchAlerts();
    
    const aqiInterval = setInterval(fetchAQIData, 60000); // Update every minute
    const alertInterval = setInterval(fetchAlerts, 30000); // Check alerts every 30 seconds

    return () => {
      clearInterval(aqiInterval);
      clearInterval(alertInterval);
    };
  }, []);

  // Fetch forecast when sensor changes
  useEffect(() => {
    if (selectedSensor) {
      fetchForecast();
    }
  }, [selectedSensor]);

  // Keep selected sensor in sync with visible data
  useEffect(() => {
    const visible = aqiData.filter((data) => selectedLocationIds.includes(data.sensor_id));
    if (!visible.length) {
      return;
    }

    if (!selectedSensor || !visible.some((item) => item.sensor_id === selectedSensor)) {
      setSelectedSensor(visible[0].sensor_id);
    }
  }, [aqiData, selectedLocationIds, selectedSensor]);

  const selectedData = aqiData.find(
    (d) => d.sensor_id === selectedSensor && selectedLocationIds.includes(d.sensor_id)
  );
  const selectedPollutants = selectedData?.pollutants ?? {
    pm25: null,
    pm10: null,
    no2: null,
    co: null,
    o3: null,
  };
  const activeSensorAlerts = alerts.filter((a) => a.sensor_id === selectedSensor && a.is_active);
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical' && a.is_active);

  const getHealthRecommendation = (aqi: number): string => {
    if (aqi <= 50) return t('healthRecommendations.good');
    if (aqi <= 100) return t('healthRecommendations.moderate');
    if (aqi <= 150) return t('healthRecommendations.sensitive');
    if (aqi <= 200) return t('healthRecommendations.unhealthy');
    if (aqi <= 300) return t('healthRecommendations.veryUnhealthy');
    return t('healthRecommendations.hazardous');
  };

  const translateCategory = (category?: string) => {
    if (!category) return t('aqiCategories.unknown');
    const normalized = category.toLowerCase();
    if (normalized.includes('hazardous')) return t('aqiCategories.hazardous');
    if (normalized.includes('very unhealthy')) return t('aqiCategories.veryUnhealthy');
    if (normalized.includes('unhealthy for sensitive') || normalized.includes('sensitive')) return t('aqiCategories.sensitive');
    if (normalized.includes('unhealthy')) return t('aqiCategories.unhealthy');
    if (normalized.includes('moderate')) return t('aqiCategories.moderate');
    if (normalized.includes('good')) return t('aqiCategories.good');
    return category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{t('dashboard.title')}</h1>
            <p className="text-gray-600 mt-2">{t('dashboard.subtitle')}</p>
          </div>
          <button
            onClick={() => {
              fetchAQIData();
              fetchAlerts();
            }}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            {t('dashboard.refresh')}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Location Selector */}
        <LocationSelector
          availableLocations={availableLocations}
          selectedLocationIds={selectedLocationIds}
          onSelectionChange={(locationIds) => {
            setSelectedLocationIds(locationIds);
            selectedLocationIdsRef.current = locationIds;
            setAqiData((prev) => prev.filter((item) => locationIds.includes(item.sensor_id)));
            localStorage.setItem('selectedLocationIds', JSON.stringify(locationIds));
            if (onLocationChange) {
              onLocationChange(locationIds);
            }
            setSelectedSensor(null); // Reset selected sensor when locations change
            // Immediately fetch new data for selected locations
            setTimeout(() => {
              fetchAQIData();
            }, 0);
          }}
        />

        {(() => {
          const visibleAqiData = aqiData.filter((data) => selectedLocationIds.includes(data.sensor_id));

          return (
            <>
              {/* AKI Review Section */}
              {visibleAqiData.length > 0 && (
          <AKIReview 
            data={visibleAqiData.map((data) => ({
              location: data.site || data.device_id || `Sensor ${data.sensor_id}`,
              aqi: typeof data.current_aqi === 'number' ? data.current_aqi : 0,
              pm25: typeof data.pollutants?.pm25 === 'number' ? data.pollutants.pm25 : 0,
              temperature: 20,
              status: data.aqi_category || 'Moderate',
            }))}
          />
              )}

        {/* Main AQI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {visibleAqiData.map((data) => (
            <button
              key={data.sensor_id}
              onClick={() => setSelectedSensor(data.sensor_id)}
              className={`p-4 rounded-lg shadow-md transition-all cursor-pointer ${
                selectedSensor === data.sensor_id ? 'ring-2 ring-blue-500 shadow-lg' : ''
              } ${data.aqi_color === '#00E400' ? 'bg-green-50' : data.aqi_color === '#FFFF00' ? 'bg-yellow-50' : data.aqi_color === '#FF7E00' ? 'bg-orange-50' : 'bg-red-50'}`}
            >
              <div className="flex items-start justify-between">
                <div className="text-left flex-1">
                  <p className="text-xs text-gray-600 truncate">{data.site || data.device_id}</p>
                  <p className="text-3xl font-bold mt-2" style={{ color: data.aqi_color }}>
                    {data.current_aqi}
                  </p>
                  <p className="text-xs text-gray-700 mt-1 font-semibold">{translateCategory(data.aqi_category)}</p>
                </div>
                <FiMapPin className="text-gray-400" size={16} />
              </div>
            </button>
          ))}
        </div>

        {/* Selected Sensor Details */}
        {selectedData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* AQI Detail Card */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedData.site || selectedData.device_id}
              </h2>

              {/* Big AQI Display */}
              <div className="flex items-center gap-8 mb-6">
                <div className="text-center">
                  <div
                    className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: selectedData.aqi_color }}
                  >
                    <span className="text-5xl font-bold text-white">{selectedData.current_aqi}</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-gray-700">{translateCategory(selectedData.aqi_category)}</p>
                </div>

                {/* Health Recommendation */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">{t('dashboard.healthRecTitle')}</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {getHealthRecommendation(selectedData.current_aqi ?? 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-3">
                    {t('dashboard.dominant')}: <span className="font-semibold">{selectedData.dominant_pollutant}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('common.updated')}: {new Date(selectedData.timestamp).toLocaleTimeString(resolvedLocale)}
                  </p>
                </div>
              </div>

              {/* Pollutant Levels */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">{t('dashboard.pollutantLevels')}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(selectedPollutants).map(([pollutant, value]) => {
                    const numericValue = Number(value);
                    const displayValue = Number.isFinite(numericValue) ? numericValue.toFixed(1) : t('common.notAvailable');
                    const pollutantLabelMap: Record<string, string> = {
                      pm25: t('pollutants.pm25'),
                      pm10: t('pollutants.pm10'),
                      no2: t('pollutants.no2'),
                      co: t('pollutants.co'),
                      o3: t('pollutants.o3'),
                    };
                    const pollutantLabel = pollutantLabelMap[pollutant] || pollutant.toUpperCase();

                    return (
                    <div key={pollutant} className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-xs text-gray-600">{pollutantLabel}</p>
                      <p className="text-lg font-bold text-gray-800">{displayValue}</p>
                    </div>
                  );
                  })}
                </div>
                {Object.values(selectedPollutants).every((value) => value === null) && (
                  <p className="text-xs text-gray-500 mt-3">
                    {t('dashboard.limitedPollutants')}
                  </p>
                )}
              </div>
            </div>

            {/* Forecast Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiTrendingUp className="text-blue-600" />
                {t('dashboard.nextHours')}
              </h3>

              {forecast.length > 0 ? (
                <div className="space-y-3">
                  {forecast.slice(0, 6).map((f) => {
                    const confidenceValue = Number(f.confidence);
                    const confidencePct = Number.isFinite(confidenceValue) ? confidenceValue * 100 : 0;

                    return (
                    <div key={f.hour} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">+{f.hour}h</p>
                        <p className="text-xs text-gray-500">{t('common.confidence')}: {confidencePct.toFixed(0)}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: '#FF7E00' }}>
                          {f.predicted_aqi}
                        </p>
                      </div>
                    </div>
                  );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">{t('dashboard.loadingForecast')}</p>
              )}
            </div>
          </div>
        )}
            </>
          );
        })()}

        {/* Weekly Trends Section */}
        <WeeklyTrends />

        {/* 7-Day Forecast Section */}
        {selectedSensor && (
          <ForecastChart
            sensorId={selectedSensor}
            sensorName={aqiData.find(sensor => sensor.sensor_id === selectedSensor)?.sensor_name}
          />
        )}

        {/* Key Terms Explanation */}
        <KeyTermsExplanation />

        {/* Main Causes of Dirty Air */}
        <MainCausesOfDirtyAir />

        {/* Air Quality Improvement Recommendations */}
        <AirQualityImprovementRecommendations />

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 rounded">
            <div className="flex items-start gap-3">
              <FiAlertTriangle className="text-red-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-bold text-red-700">🚨 {t('dashboard.criticalAlerts')} ({criticalAlerts.length})</h3>
                <div className="mt-2 space-y-1">
                  {criticalAlerts.slice(0, 3).map((alert) => (
                    <p key={alert.id} className="text-red-600 text-sm">
                      • {alert.message}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sensor Alerts */}
        {activeSensorAlerts.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{t('dashboard.activeAlerts')}</h3>
            <div className="space-y-3">
              {activeSensorAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border-l-4 rounded ${
                    alert.severity === 'critical'
                      ? 'bg-red-50 border-red-500'
                      : alert.severity === 'high'
                        ? 'bg-orange-50 border-orange-500'
                        : 'bg-yellow-50 border-yellow-500'
                  }`}
                >
                  <p className="font-semibold text-gray-800">{alert.message}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(alert.created_at).toLocaleString(resolvedLocale)} •{' '}
                    <span className="capitalize font-semibold">{alert.severity}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm mt-8">
          <p>{t('common.lastUpdated')}: {lastUpdate ? lastUpdate.toLocaleTimeString(resolvedLocale) : t('common.never')}</p>
          <p className="mt-1">{t('dashboard.footerNote')}</p>
        </div>
      </div>
    </div>
  );
};

export default AQIDashboard;
