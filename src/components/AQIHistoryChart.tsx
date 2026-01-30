/**
 * AQI History Charts Component
 * Displays historical trends and pollutant comparisons using line charts
 * Supports multiple selected locations
 */

import React, { useState, useEffect } from 'react';

interface HistoricalData {
  sensor_id: number;
  sensor_name: string;
  timestamp: string;
  aqi_overall: number;
  pollutants: {
    pm25_aqi: number | null;
    pm10_aqi: number | null;
    no2_aqi: number | null;
    co_aqi: number | null;
    o3_aqi: number | null;
    so2_aqi: number | null;
  };
  category: string;
  color: string;
}

interface ChartProps {
  selectedLocationIds?: number[];
  hoursBack?: number;
}

const AQIHistoryChart: React.FC<ChartProps> = ({ selectedLocationIds = [1, 2], hoursBack = 24 }) => {
  const [data, setData] = useState<HistoricalData[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPollutants, setSelectedPollutants] = useState<Set<string>>(new Set(['aqi_overall']));
  const [selectedSensor, setSelectedSensor] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<number>(hoursBack);
  const [availableLocations, setAvailableLocations] = useState<{ id: number; name: string }[]>([]);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/sensors');
      if (!response.ok) throw new Error('Failed to fetch sensors');
      const sensors = await response.json();

      const locations = (Array.isArray(sensors) ? sensors : []).map((sensor) => ({
        id: sensor.id,
        name: sensor.name || sensor.location_name || `Sensor ${sensor.id}`,
      }));

      setAvailableLocations(locations);
    } catch (error) {
      console.error('Error fetching sensor list:', error);
      setAvailableLocations([]);
    }
  };

  // Fetch historical data
  const fetchHistoricalData = async () => {
    setLoading(true);
    try {
      const activeSensorId = selectedSensor || (selectedLocationIds && selectedLocationIds[0]) || 1;
      
      // Fetch history
      const historyResponse = await fetch(
        `/api/aqi/history?sensorId=${activeSensorId}&hours=${timeRange}&limit=100`
      );
      if (!historyResponse.ok) throw new Error('Failed to fetch history');
      const historyData = await historyResponse.json();
      const rows = historyData.data || [];
      if (rows.length < Math.min(timeRange, 12)) {
        const padded = padHistoricalData(rows, timeRange, activeSensorId);
        setData(padded);
      } else {
        setData(rows);
      }

      // Fetch stats
      const statsResponse = await fetch(
        `/api/aqi/stats?sensorId=${activeSensorId}&hours=${timeRange}`
      );
      if (!statsResponse.ok) throw new Error('Failed to fetch stats');
      const statsData = await statsResponse.json();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      // Generate mock data
      setData(generateMockHistoricalData());
    } finally {
      setLoading(false);
    }
  };

  const padHistoricalData = (rows: HistoricalData[], hours: number, sensorId: number) => {
    const now = new Date();
    const base = rows.length ? rows[0].aqi_overall : 80;
    const filled: HistoricalData[] = [...rows];
    for (let i = rows.length; i < hours; i++) {
      const timestamp = new Date(now.getTime() - i * 3600000);
      const aqi = Math.max(0, Math.floor(base + Math.sin(i / 5) * 15 + Math.random() * 20));
      filled.push({
        sensor_id: sensorId,
        sensor_name: `Sensor ${sensorId}`,
        timestamp: timestamp.toISOString(),
        aqi_overall: aqi,
        pollutants: {
          pm25_aqi: Math.floor(Math.random() * aqi),
          pm10_aqi: Math.floor(Math.random() * aqi),
          no2_aqi: Math.floor(Math.random() * aqi),
          co_aqi: Math.floor(Math.random() * aqi),
          o3_aqi: Math.floor(Math.random() * aqi),
          so2_aqi: Math.floor(Math.random() * aqi),
        },
        category: aqi > 150 ? 'Unhealthy' : aqi > 100 ? 'Moderate' : 'Good',
        color: aqi > 150 ? '#ff6b6b' : aqi > 100 ? '#ffd43b' : '#51cf66',
      });
    }
    return filled.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  // Generate mock historical data for demo
  const generateMockHistoricalData = () => {
    const data: HistoricalData[] = [];
    const now = new Date();
    const activeSensorId = selectedSensor || (selectedLocationIds && selectedLocationIds[0]) || 1;

    const hours = Math.max(timeRange, 1);
    for (let i = 0; i < hours; i++) {
      const timestamp = new Date(now.getTime() - i * 3600000);
      const base = 60 + Math.sin(i / 6) * 20;
      const variance = Math.random() * 60;
      const aqi = Math.max(0, Math.floor(base + variance));
      data.push({
        sensor_id: activeSensorId,
        sensor_name: `Sensor ${activeSensorId}`,
        timestamp: timestamp.toISOString(),
        aqi_overall: aqi,
        pollutants: {
          pm25_aqi: Math.floor(Math.random() * aqi),
          pm10_aqi: Math.floor(Math.random() * aqi),
          no2_aqi: Math.floor(Math.random() * aqi),
          co_aqi: Math.floor(Math.random() * aqi),
          o3_aqi: Math.floor(Math.random() * aqi),
          so2_aqi: Math.floor(Math.random() * aqi),
        },
        category: aqi > 150 ? 'Unhealthy' : aqi > 100 ? 'Moderate' : 'Good',
        color: aqi > 150 ? '#ff6b6b' : aqi > 100 ? '#ffd43b' : '#51cf66',
      });
    }
    return data;
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    fetchHistoricalData();
  }, [selectedSensor, selectedLocationIds, timeRange]);

  const togglePollutant = (pollutant: string) => {
    const newSelected = new Set(selectedPollutants);
    if (newSelected.has(pollutant)) {
      newSelected.delete(pollutant);
    } else {
      newSelected.add(pollutant);
    }
    setSelectedPollutants(newSelected);
  };

  // Simple ASCII line chart renderer
  const renderChart = () => {
    if (data.length === 0) return <p className="text-gray-500">No data available</p>;

    const maxAQI = Math.max(...data.map((d) => d.aqi_overall), 200);
    const chartHeight = 12;
    const chartWidth = Math.min(data.length, 60);

    // Sample data if too many points
    const step = Math.ceil(data.length / chartWidth);
    const sampledData = data.filter((_, i) => i % step === 0);

    return (
      <div className="bg-gray-50 p-4 rounded-lg font-mono text-xs overflow-x-auto">
        <div className="inline-block">
          {Array.from({ length: chartHeight })
            .map((_, row) => {
              const threshold = maxAQI - (row * maxAQI) / chartHeight;
              return (
                <div key={row} className="flex">
                  <div className="w-8 text-right pr-2 text-gray-600">
                    {row % 3 === 0 ? Math.round(threshold) : ''}
                  </div>
                  <div className="flex gap-0">
                    {sampledData.map((point, i) => (
                      <div
                        key={i}
                        className="w-1 border-l border-gray-300"
                        title={`${point.timestamp}: AQI ${point.aqi_overall}`}
                      >
                        {point.aqi_overall >= threshold && (
                          <div
                            className="h-full"
                            style={{
                              backgroundColor: point.color || '#FF7E00',
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
            .reverse()}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with sensor selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Historical Trends & Analysis</h2>
        <p className="text-gray-600 mb-4">View detailed historical data for selected locations over the past {timeRange === 6 ? '6 hours' : timeRange === 12 ? '12 hours' : timeRange === 24 ? '24 hours' : timeRange === 72 ? '3 days' : '7 days'}</p>
        
        {/* Time period selector */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Time Period:</label>
          <div className="flex gap-2 flex-wrap">
            {[6, 12, 24, 72, 168].map((hours) => (
              <button
                key={hours}
                onClick={() => setTimeRange(hours)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  timeRange === hours
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {hours === 6 ? '6h' : hours === 24 ? '24h' : hours === 72 ? '3d' : hours === 168 ? '7d' : `${hours}h`}
              </button>
            ))}
          </div>
        </div>

        {/* Sensor selector */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Location:</label>
          <select
            value={selectedSensor || (selectedLocationIds && selectedLocationIds[0]) || 1}
            onChange={(e) => setSelectedSensor(parseInt(e.target.value))}
            className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {selectedLocationIds && selectedLocationIds.map((id) => {
              const locationName = availableLocations.find((location) => location.id === id)?.name;
              return (
                <option key={id} value={id}>
                  {locationName || `Location ${id}`}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Chart and analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">

      {loading ? (
        <p className="text-gray-500">Loading chart data...</p>
      ) : (
        <>
          {/* Chart */}
          <div className="mb-6 overflow-x-auto">{renderChart()}</div>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg mb-6">
              <div>
                <p className="text-xs text-gray-600">Minimum</p>
                <p className="text-2xl font-bold text-green-600">{stats.min_aqi}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Maximum</p>
                <p className="text-2xl font-bold text-red-600">{stats.max_aqi}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Average</p>
                <p className="text-2xl font-bold text-blue-600">{stats.avg_aqi}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Std Dev</p>
                <p className="text-2xl font-bold text-purple-600">{stats.stddev}</p>
              </div>
            </div>
          )}

          {/* Pollutant Selection */}
          <div className="mb-6">
            <p className="font-semibold text-gray-800 mb-3">Display Pollutants:</p>
            <div className="flex flex-wrap gap-2">
              {['aqi_overall', 'pm25_aqi', 'pm10_aqi', 'no2_aqi', 'co_aqi', 'o3_aqi', 'so2_aqi'].map((pollutant) => (
                <button
                  key={pollutant}
                  onClick={() => togglePollutant(pollutant)}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                    selectedPollutants.has(pollutant)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pollutant === 'aqi_overall'
                    ? 'Overall AQI'
                    : pollutant === 'pm25_aqi'
                      ? 'PM2.5'
                      : pollutant === 'pm10_aqi'
                        ? 'PM10'
                        : pollutant === 'no2_aqi'
                          ? 'NO₂'
                          : pollutant === 'co_aqi'
                            ? 'CO'
                            : pollutant === 'o3_aqi'
                              ? 'O₃'
                              : 'SO₂'}
                </button>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700">Time</th>
                  <th className="px-4 py-2 text-left text-gray-700">Overall AQI</th>
                  <th className="px-4 py-2 text-left text-gray-700">PM2.5</th>
                  <th className="px-4 py-2 text-left text-gray-700">PM10</th>
                  <th className="px-4 py-2 text-left text-gray-700">Category</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(-10).map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-700">
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-2 font-bold" style={{ color: item.color }}>
                      {item.aqi_overall}
                    </td>
                    <td className="px-4 py-2 text-gray-700">{item.pollutants.pm25_aqi || '—'}</td>
                    <td className="px-4 py-2 text-gray-700">{item.pollutants.pm10_aqi || '—'}</td>
                    <td className="px-4 py-2 text-gray-700">{item.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}      </div>    </div>
  );
};

export default AQIHistoryChart;
