/**
 * Weekly Trends Component
 * Displays historical AQI data trends over the past week
 */

import React from 'react';
import { useLanguage } from '../i18n.js';

interface TrendData {
  day: string;
  aqi: number;
  trend: 'up' | 'down' | 'stable';
}

interface WeeklyTrendsProps {
  data?: TrendData[];
}

const WeeklyTrends: React.FC<WeeklyTrendsProps> = ({ data }) => {
  const { t } = useLanguage();
  // Mock data for demonstration if not provided
  const trendData = data || [
    { day: t('weeklyTrends.days.mon'), aqi: 85, trend: 'up' as const },
    { day: t('weeklyTrends.days.tue'), aqi: 92, trend: 'up' as const },
    { day: t('weeklyTrends.days.wed'), aqi: 78, trend: 'down' as const },
    { day: t('weeklyTrends.days.thu'), aqi: 65, trend: 'down' as const },
    { day: t('weeklyTrends.days.fri'), aqi: 72, trend: 'up' as const },
    { day: t('weeklyTrends.days.sat'), aqi: 45, trend: 'down' as const },
    { day: t('weeklyTrends.days.sun'), aqi: 38, trend: 'down' as const },
  ];

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#10b981'; // Green
    if (aqi <= 100) return '#fbbf24'; // Yellow
    if (aqi <= 150) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const maxAQI = Math.max(...trendData.map(d => d.aqi), 150);
  const avgAQI = Math.round(trendData.reduce((sum, d) => sum + d.aqi, 0) / trendData.length);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('weeklyTrends.title')}</h2>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-gray-600">{t('weeklyTrends.averageLabel')}: <span className="font-bold text-lg text-blue-600">{avgAQI}</span></p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end justify-between gap-3 mb-8 h-64">
        {trendData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            {/* Bar */}
            <div className="relative w-full flex flex-col items-center mb-2">
              <div
                className="w-full rounded-t-lg transition-all duration-300 hover:shadow-lg"
                style={{
                  height: `${(item.aqi / maxAQI) * 200}px`,
                  backgroundColor: getAQIColor(item.aqi),
                  minHeight: '8px',
                }}
              />
              {/* Value Label */}
              <div className="mt-2 text-sm font-bold text-gray-800">{item.aqi}</div>
            </div>

            {/* Day Label */}
            <div className="text-sm font-semibold text-gray-600">{item.day}</div>

            {/* Trend Icon */}
            <div className="mt-1">
              {item.trend === 'up' && <span className="text-orange-500 text-lg">↑</span>}
              {item.trend === 'down' && <span className="text-green-500 text-lg">↓</span>}
              {item.trend === 'stable' && <span className="text-gray-400 text-lg">→</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Insight */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-blue-900 text-sm">
          <span className="font-bold">{t('weeklyTrends.insightTitle')}</span> {t('weeklyTrends.insightBody')}
        </p>
      </div>
    </div>
  );
};

export default WeeklyTrends;
