/**
 * Forecast Chart Component
 * Displays 7-day AQI forecast with confidence levels
 */

import React, { useState, useEffect } from 'react';

interface ForecastData {
  hour: number;
  predicted_aqi: number;
  confidence: number;
  valid_at: string;
}

interface ForecastChartProps {
  sensorId: number;
  sensorName?: string;
}

const ForecastChart: React.FC<ForecastChartProps> = ({ sensorId, sensorName }) => {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchForecast();
  }, [sensorId]);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/forecast/${sensorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
      }
      const data = await response.json();
      setForecastData(data.forecasts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching forecast:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#10b981'; // Green - Good
    if (aqi <= 100) return '#fbbf24'; // Yellow - Moderate
    if (aqi <= 150) return '#f97316'; // Orange - Unhealthy for sensitive groups
    if (aqi <= 200) return '#ef4444'; // Red - Unhealthy
    if (aqi <= 300) return '#8b5cf6'; // Purple - Very unhealthy
    return '#6b21a8'; // Maroon - Hazardous
  };

  const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  // Group forecasts by day
  const groupByDay = (forecasts: ForecastData[]) => {
    const days: { [key: string]: ForecastData[] } = {};
    forecasts.forEach(forecast => {
      const date = new Date(forecast.valid_at);
      const dayKey = date.toDateString();
      if (!days[dayKey]) days[dayKey] = [];
      days[dayKey].push(forecast);
    });
    return days;
  };

  const dailyForecasts = groupByDay(forecastData);
  const dayLabels = Object.keys(dailyForecasts).slice(0, 3); // Next 3 days

  // Calculate daily averages
  const dailyAverages = dayLabels.map(day => {
    const dayForecasts = dailyForecasts[day];
    const avgAQI = Math.round(dayForecasts.reduce((sum, f) => sum + f.predicted_aqi, 0) / dayForecasts.length);
    const avgConfidence = dayForecasts.reduce((sum, f) => sum + f.confidence, 0) / dayForecasts.length;
    return { day, avgAQI, avgConfidence };
  });

  const maxAQI = Math.max(...dailyAverages.map(d => d.avgAQI), 150);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="text-red-600">
          <h2 className="text-xl font-bold mb-2">Forecast Unavailable</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!forecastData.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">7-Day Air Quality Forecast</h2>
        <p className="text-gray-600">No forecast data available for this sensor.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          3-Day Air Quality Forecast
          {sensorName && <span className="text-lg font-normal text-gray-600"> - {sensorName}</span>}
        </h2>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-gray-600">
            Next 3 days • Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="mb-8">
        <div className="flex items-end justify-between gap-2 mb-4 h-64">
          {dailyAverages.map((item, index) => {
            const dayName = new Date(item.day).toLocaleDateString('en-US', { weekday: 'short' });
            const dateNum = new Date(item.day).getDate();

            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                {/* Bar */}
                <div className="relative w-full flex flex-col items-center mb-2 group">
                  <div
                    className="w-full rounded-t-lg transition-all duration-300 hover:shadow-lg cursor-pointer"
                    style={{
                      height: `${(item.avgAQI / maxAQI) * 200}px`,
                      backgroundColor: getAQIColor(item.avgAQI),
                      minHeight: '8px',
                    }}
                    title={`${dayName} ${dateNum}: ${item.avgAQI} AQI (${getAQICategory(item.avgAQI)}) - Confidence: ${(item.avgConfidence * 100).toFixed(0)}%`}
                  />
                  {/* Confidence indicator */}
                  <div
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full border border-white"
                    style={{ backgroundColor: item.avgConfidence > 0.7 ? '#10b981' : item.avgConfidence > 0.5 ? '#fbbf24' : '#ef4444' }}
                    title={`Confidence: ${(item.avgConfidence * 100).toFixed(0)}%`}
                  ></div>
                  {/* Value Label */}
                  <div className="mt-2 text-sm font-bold text-gray-800">{item.avgAQI}</div>
                </div>

                {/* Day Label */}
                <div className="text-sm font-semibold text-gray-600">{dayName}</div>
                <div className="text-xs text-gray-500">{dateNum}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ForecastChart;