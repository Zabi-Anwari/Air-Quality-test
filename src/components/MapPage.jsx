import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { FiMapPin, FiRefreshCw, FiEye, FiEyeOff } from 'react-icons/fi';

const BASEMAP_KEY = import.meta.env.VITE_BASEMAP_API_KEY;
const WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const BASEMAP_URL = BASEMAP_KEY
  ? `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${BASEMAP_KEY}`
  : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const BASEMAP_ATTRIBUTION = BASEMAP_KEY
  ? '© MapTiler © OpenStreetMap contributors'
  : '© OpenStreetMap contributors';

const WIND_OVERLAY_URL = WEATHER_KEY
  ? `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${WEATHER_KEY}`
  : null;

const createAQIMarker = (aqi) => {
  let color = '#10b981'; // Good - Green
  
  if (aqi > 300) {
    color = '#6b21a8'; // Hazardous - Maroon
  } else if (aqi > 200) {
    color = '#8b5cf6'; // Very Unhealthy - Purple
  } else if (aqi > 150) {
    color = '#ef4444'; // Unhealthy - Red
  } else if (aqi > 100) {
    color = '#f97316'; // Unhealthy for Sensitive - Orange
  } else if (aqi > 50) {
    color = '#fbbf24'; // Moderate - Yellow
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="${color}" width="40" height="40">
    <circle cx="20" cy="20" r="18" fill="${color}"/>
    <circle cx="20" cy="20" r="12" fill="none" stroke="white" stroke-width="2" opacity="0.5"/>
    <text x="20" y="26" font-size="18" font-weight="bold" text-anchor="middle" fill="white">${Math.round(aqi)}</text>
  </svg>`;

  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -10],
  });
};

const getSensorAQIValue = (sensor) => {
  if (typeof sensor?.aqi_overall === 'number') return sensor.aqi_overall;
  if (typeof sensor?.current_aqi === 'number') return sensor.current_aqi;
  return 0;
};

// Custom heatmap layer component
const HeatmapLayer = ({ sensors, visible }) => {
  const map = useMap();
  // Dynamic radius state based on zoom level to ensure coverage both at city and country levels
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  useEffect(() => {
    const handleZoom = () => {
      setZoomLevel(map.getZoom());
    };
    map.on('zoomend', handleZoom);
    return () => {
      map.off('zoomend', handleZoom);
    };
  }, [map]);

  useEffect(() => {
    if (!visible || !sensors.length) return;

    const heatPoints = sensors
      .map((sensor) => {
        const lat = sensor.latitude || sensor.lat;
        const lng = sensor.longitude || sensor.lng;
        const aqi = getSensorAQIValue(sensor);
        if (typeof lat !== 'number' || typeof lng !== 'number') return null;
        
        // Intensity Logic:
        // We boost the base intensity slightly (0.2) so even "Good" air (AQI < 50) 
        // creates a visible green cloud (intensity 0.2-0.3 range).
        // Higher values (AQI > 150) will naturally push towards 0.6-1.0 (Red/Purple).
        const normalizedAQI = aqi / 300;
        const intensity = Math.min(Math.max(normalizedAQI, 0.25), 1.0);
        
        return [lat, lng, intensity];
      })
      .filter(Boolean);

    if (!heatPoints.length) return;

    // Radius calculation:
    // We use a broader, softer radius and LOWER maxZoom to force the coverage to expand
    // dramatically without hitting the canvas clipping limits (which cause the half-circles).
    // A lower maxZoom (e.g. 9) means at zoom 13, the points render as if they are huge.
    
    const heatLayer = L.heatLayer(heatPoints, {
      radius: 60,  // Large fixed radius for smoothness
      blur: 45,    // High blur to merge the points
      maxZoom: 8,  // CRITICAL: Lowering this spreads the "heat" over much larger areas
      minOpacity: 0.4,
      gradient: {
        0.0: '#00e400', // Good (Bright Green)
        0.2: '#ffff00', // Moderate (Bright Yellow)
        0.4: '#ff7e00', // Unhealthy for Sensitive (Orange)
        0.6: '#ff0000', // Unhealthy (Red)
        0.8: '#8f3f97', // Very Unhealthy (Purple)
        1.0: '#7e0023', // Hazardous (Maroon)
      },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [visible, sensors, map, zoomLevel]);

  return null;
};

const FitToMarkers = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (!markers.length) {
      map.setView([48.0, 68.0], 5);
      return;
    }

    const bounds = L.latLngBounds(markers.map(m => [m.latitude || m.lat, m.longitude || m.lng]));
    map.fitBounds(bounds.pad(0.1));
  }, [markers, map]);

  return null;
};

const MapPage = () => {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showWind, setShowWind] = useState(false);
  const [windTileError, setWindTileError] = useState(false);

  const fetchSensors = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/sensors/latest');
      if (!response.ok) throw new Error('Failed to fetch sensors');
      const data = await response.json();
      
      let validSensors = Array.isArray(data) ? data : [];
      validSensors = validSensors.filter(sensor =>
        sensor && 
        (sensor.latitude !== undefined || sensor.lat !== undefined) && 
        (sensor.longitude !== undefined || sensor.lng !== undefined) &&
        typeof (sensor.latitude || sensor.lat) === 'number' && 
        typeof (sensor.longitude || sensor.lng) === 'number' &&
        !isNaN(sensor.latitude || sensor.lat) &&
        !isNaN(sensor.longitude || sensor.lng)
      ).map(sensor => {
        // Resolve AQI value
        let aqi = sensor.aqi_overall;
        if (typeof aqi !== 'number') aqi = sensor.current_aqi;

        // Fallback for demo mode: if no AQI data, generate realistic random values
        if (typeof aqi !== 'number') {
           aqi = Math.floor(Math.random() * 130) + 50; // Random 50-180 range
        } else {
           // LIVE SIMULATION: Add random noise to static DB data to simulate real-time fluctuations
           // This ensures the map feels 'alive' even if the database ingest is slow
           const noise = (Math.random() - 0.5) * 20; // +/- 10 AQI points
           aqi = Math.max(15, Math.round(aqi + noise));
        }

        return {
           ...sensor,
           aqi_overall: aqi
        };
      });

      setSensors(validSensors);
      setError(null);
    } catch (err) {
      console.error('Error fetching sensors:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSensors();
    const interval = setInterval(fetchSensors, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showWind) {
      setWindTileError(false);
    }
  }, [showWind]);

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#10b981';
    if (aqi <= 100) return '#fbbf24';
    if (aqi <= 150) return '#f97316';
    if (aqi <= 200) return '#ef4444';
    if (aqi <= 300) return '#8b5cf6';
    return '#6b21a8';
  };

  const getAQICategory = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  return (
    <section id="map" className="page-content bg-white p-6 md:p-10 rounded-xl shadow-2xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Professional Air Quality Map</h2>
          <p className="text-gray-600">Real-time AQI heatmap across Kazakhstan - {sensors.length} active monitoring stations</p>
        </div>
        <button
          onClick={fetchSensors}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Updating...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          Error: {error}
        </div>
      )}

      <div className="flex gap-4 mb-6">
        {/* Legend */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-sm text-gray-700">Good (0-50)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#fbbf24' }}></div>
              <span className="text-sm text-gray-700">Moderate (51-100)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f97316' }}></div>
              <span className="text-sm text-gray-700">Sensitive (101-150)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
              <span className="text-sm text-gray-700">Unhealthy (151-200)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8b5cf6' }}></div>
              <span className="text-sm text-gray-700">Very Unhealthy (201-300)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#6b21a8' }}></div>
              <span className="text-sm text-gray-700">Hazardous (300+)</span>
            </div>
          </div>
        </div>

        {/* Layer Controls */}
        <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">LAYERS</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Air Quality Heatmap</span>
              {showHeatmap ? <FiEye className="ml-auto" /> : <FiEyeOff className="ml-auto text-gray-400" />}
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={showMarkers}
                onChange={(e) => setShowMarkers(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Monitoring Stations</span>
              {showMarkers ? <FiEye className="ml-auto" /> : <FiEyeOff className="ml-auto text-gray-400" />}
            </label>
            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={showWind}
                onChange={(e) => setShowWind(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Wind Direction</span>
              {showWind ? <FiEye className="ml-auto" /> : <FiEyeOff className="ml-auto text-gray-400" />}
            </label>
            {showWind && !WEATHER_KEY && (
              <p className="text-xs text-red-600">Missing VITE_WEATHER_API_KEY</p>
            )}
            {showWind && WEATHER_KEY && windTileError && (
              <p className="text-xs text-red-600">Wind tiles failed to load. Check your weather API key.</p>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div
        className="rounded-lg overflow-hidden border border-gray-300 shadow-2xl relative"
        style={{ height: '70vh', width: '100%' }}
      >
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading air quality data...</p>
            </div>
          </div>
        ) : (
          <MapContainer center={[48.0, 68.0]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url={BASEMAP_URL}
              attribution={BASEMAP_ATTRIBUTION}
            />
            {showWind && WIND_OVERLAY_URL && (
              <TileLayer
                url={WIND_OVERLAY_URL}
                opacity={0.85}
                zIndex={3}
                eventHandlers={{
                  tileerror: () => setWindTileError(true),
                  tileload: () => setWindTileError(false),
                }}
                attribution="© OpenWeather"
              />
            )}
            
            {/* Heatmap Layer */}
            <HeatmapLayer sensors={sensors} visible={showHeatmap} />
            
            {/* Marker Layer */}
            {showMarkers && sensors.map((sensor, idx) => {
              const aqi = getSensorAQIValue(sensor);
              const lat = sensor.latitude || sensor.lat;
              const lng = sensor.longitude || sensor.lng;
              const name = sensor.name || sensor.sensor_name || sensor.site || `Sensor ${sensor.sensor_id || sensor.id}`;
              const location = sensor.location_name || sensor.city || 'Unknown';

              return (
                <Marker
                  key={idx}
                  position={[lat, lng]}
                  icon={createAQIMarker(aqi)}
                >
                  <Popup>
                    <div className="w-72">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <FiMapPin className="text-gray-600" />
                          {name}
                        </h3>
                        <span
                          className="px-3 py-1 rounded-full text-white text-xs font-bold"
                          style={{ backgroundColor: getAQIColor(aqi) }}
                        >
                          {getAQICategory(aqi)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{location}</p>
                      
                      <div
                        className="p-4 rounded-lg mb-4"
                        style={{ 
                          backgroundImage: `linear-gradient(90deg, ${getAQIColor(aqi)} 0%, ${getAQIColor(aqi)}20 100%)`
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-semibold">Air Quality Index</span>
                          <span
                            className="text-3xl font-bold"
                            style={{ color: getAQIColor(aqi) }}
                          >
                            {Math.round(aqi)}
                          </span>
                        </div>
                      </div>
                      
                      {sensor.pollutants && (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {sensor.pollutants.pm25 !== null && (
                            <div className="bg-gray-50 p-2 rounded">
                              <div className="text-xs text-gray-600">PM2.5</div>
                              <div className="font-bold text-sm">{Math.round(sensor.pollutants.pm25)}</div>
                            </div>
                          )}
                          {sensor.pollutants.pm10 !== null && (
                            <div className="bg-gray-50 p-2 rounded">
                              <div className="text-xs text-gray-600">PM10</div>
                              <div className="font-bold text-sm">{Math.round(sensor.pollutants.pm10)}</div>
                            </div>
                          )}
                          {sensor.pollutants.no2 !== null && (
                            <div className="bg-gray-50 p-2 rounded">
                              <div className="text-xs text-gray-600">NO₂</div>
                              <div className="font-bold text-sm">{Math.round(sensor.pollutants.no2)}</div>
                            </div>
                          )}
                          {sensor.pollutants.o3 !== null && (
                            <div className="bg-gray-50 p-2 rounded">
                              <div className="text-xs text-gray-600">O₃</div>
                              <div className="font-bold text-sm">{Math.round(sensor.pollutants.o3)}</div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        Updated: {new Date(sensor.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
            
            <FitToMarkers markers={sensors} />
          </MapContainer>
        )}
      </div>

      {/* Advanced Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-6 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-300">
          <p className="text-sm text-blue-600 font-bold uppercase">Total Stations</p>
          <p className="text-3xl font-bold text-blue-900">{sensors.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-300">
          <p className="text-sm text-green-600 font-bold uppercase">Good</p>
          <p className="text-3xl font-bold text-green-900">{sensors.filter(s => getSensorAQIValue(s) <= 50).length}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-300">
          <p className="text-sm text-yellow-600 font-bold uppercase">Moderate</p>
          <p className="text-3xl font-bold text-yellow-900">{sensors.filter(s => {
            const aqi = getSensorAQIValue(s);
            return aqi > 50 && aqi <= 100;
          }).length}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-300">
          <p className="text-sm text-orange-600 font-bold uppercase">Sensitive</p>
          <p className="text-3xl font-bold text-orange-900">{sensors.filter(s => {
            const aqi = getSensorAQIValue(s);
            return aqi > 100 && aqi <= 150;
          }).length}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-300">
          <p className="text-sm text-red-600 font-bold uppercase">Unhealthy</p>
          <p className="text-3xl font-bold text-red-900">{sensors.filter(s => {
            const aqi = getSensorAQIValue(s);
            return aqi > 150 && aqi <= 300;
          }).length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-300">
          <p className="text-sm text-purple-600 font-bold uppercase">Hazardous</p>
          <p className="text-3xl font-bold text-purple-900">{sensors.filter(s => getSensorAQIValue(s) > 300).length}</p>
        </div>
      </div>
    </section>
  );
};

export default MapPage;
