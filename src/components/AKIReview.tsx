/**
 * AKI Review Component
 * Displays bar chart comparing AQI values across different locations
 */

import React from 'react';

interface AKIData {
  location: string;
  aqi: number;
  pm25: number;
  temperature: number;
  status: string;
}

interface AKIReviewProps {
  data: AKIData[];
}

const AKIReview: React.FC<AKIReviewProps> = ({ data }) => {
  const maxAQI = 150; // Max scale for display
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'good':
        return 'bg-green-400';
      case 'moderate':
        return 'bg-yellow-400';
      case 'not suitable for sensitive groups':
      case 'unhealthy for sensitive groups':
        return 'bg-orange-400';
      case 'unhealthy':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'not suitable for sensitive groups':
      case 'unhealthy for sensitive groups':
        return 'bg-orange-100 text-orange-800';
      case 'unhealthy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">AKI Review (Max 150)</h2>
        <p className="text-gray-500 text-xs mt-0.5">Comparison of Air Quality Index across locations</p>
      </div>

      {/* Compact Bar Charts */}
      <div className="space-y-2 mb-6">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            {/* Location Name */}
            <div className="w-28 flex-shrink-0">
              <p className="text-xs font-semibold text-gray-700 truncate">{item.location}</p>
            </div>

            {/* Bar Chart */}
            <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full ${getStatusColor(item.status)} rounded-full transition-all duration-300`}
                style={{ width: `${(item.aqi / maxAQI) * 100}%` }}
              />
            </div>

            {/* AQI Value */}
            <div className="w-12 text-right flex-shrink-0">
              <p className="text-sm font-bold text-gray-800">{item.aqi}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Compact Detailed Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-50">
              <th className="text-left py-2 px-2 text-gray-700 font-semibold">Location</th>
              <th className="text-center py-2 px-2 text-gray-700 font-semibold">AQI</th>
              <th className="text-center py-2 px-2 text-gray-700 font-semibold">PM2.5</th>
              <th className="text-center py-2 px-2 text-gray-700 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-2 text-gray-800 font-medium">{item.location}</td>
                <td className="py-2 px-2 text-center">
                  <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 font-semibold text-xs">
                    {item.aqi}
                  </span>
                </td>
                <td className="py-2 px-2 text-center text-gray-700 text-xs">{item.pm25.toFixed(1)}</td>
                <td className="py-2 px-2 text-center">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeColor(item.status)}`}>
                    {item.status.length > 12 ? item.status.substring(0, 12) + '...' : item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AKIReview;
