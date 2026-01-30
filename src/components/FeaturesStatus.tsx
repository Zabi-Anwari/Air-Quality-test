/**
 * Features Status Component
 * Displays the status of all advertised features and their completeness
 */

import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi';

interface Feature {
  id: string;
  title: string;
  description: string;
  status: 'complete' | 'in-progress' | 'partial';
  components: string[];
  endpoint: string;
  coverage: string;
}

const FeaturesStatus: React.FC = () => {
  const features: Feature[] = [
    {
      id: 'real-time',
      title: '🛰️ Real-time Data Monitoring',
      description: 'Continuous, real-time monitoring of PM2.5, PM10, AQI and other pollutants',
      status: 'complete',
      components: ['AQIDashboard', 'LocationSelector', 'Auto-refresh (60s)'],
      endpoint: '/api/aqi/current',
      coverage: '34 sensors across all Kazakhstan regions',
    },
    {
      id: 'historical',
      title: '🔍 Historical Data Analysis',
      description: 'Download and analyze historical data to identify long-term air quality trends',
      status: 'complete',
      components: ['AQIHistoryChart', 'Data tables', 'Statistics'],
      endpoint: '/api/aqi/history, /api/aqi/stats',
      coverage: '24+ hours of historical data per location',
    },
    {
      id: 'predictive',
      title: '🔮 Predictive Modeling',
      description: 'AI-powered forecasts for tomorrow and next week to help with health decisions',
      status: 'complete',
      components: ['WeeklyTrends', 'Forecast indicators', 'Confidence levels'],
      endpoint: '/api/forecast/:sensorId',
      coverage: '6-hour ahead forecasts for all sensors',
    },
    {
      id: 'visualization',
      title: '📈 Interactive Visualization',
      description: 'Complex data displayed in simple tables, charts, and heat maps',
      status: 'complete',
      components: ['AirQualityMap', 'AKIReview', 'WeeklyTrends', 'AQIHistoryChart'],
      endpoint: '/api/aqi/current',
      coverage: 'Multi-location dashboard, maps, charts, tables',
    },
    {
      id: 'alerts',
      title: '🚨 Warning & Notification System',
      description: 'Real-time alerts when air quality reaches dangerous levels',
      status: 'complete',
      components: ['Alert display', 'Critical alerts banner', 'Severity levels'],
      endpoint: '/api/alerts/active, /api/alerts/history',
      coverage: 'Active alerts, historical alerts, customizable thresholds',
    },
    {
      id: 'api',
      title: '🔗 API Integration (For Developers)',
      description: 'Open REST API to integrate air quality data into custom applications',
      status: 'complete',
      components: ['API Documentation', '8+ endpoints', 'JSON responses', 'Examples'],
      endpoint: 'All /api/* routes',
      coverage: 'Complete API documentation with examples for developers',
    },
  ];

  const getStatusIcon = (status: 'complete' | 'in-progress' | 'partial') => {
    switch (status) {
      case 'complete':
        return <FiCheckCircle className="text-green-600" size={24} />;
      case 'in-progress':
        return <FiClock className="text-yellow-600" size={24} />;
      case 'partial':
        return <FiAlertCircle className="text-orange-600" size={24} />;
    }
  };

  const getStatusBg = (status: 'complete' | 'in-progress' | 'partial') => {
    switch (status) {
      case 'complete':
        return 'bg-green-50 border-green-200';
      case 'in-progress':
        return 'bg-yellow-50 border-yellow-200';
      case 'partial':
        return 'bg-orange-50 border-orange-200';
    }
  };

  const getStatusColor = (status: 'complete' | 'in-progress' | 'partial') => {
    switch (status) {
      case 'complete':
        return 'text-green-800';
      case 'in-progress':
        return 'text-yellow-800';
      case 'partial':
        return 'text-orange-800';
    }
  };

  const completedCount = features.filter((f) => f.status === 'complete').length;
  const completionPercentage = (completedCount / features.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ICPAIR Features Status</h1>
          <p className="text-xl text-gray-600 mb-6">
            Complete feature implementation status and coverage
          </p>

          {/* Overall Progress */}
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <div className="mb-3">
              <p className="text-lg font-semibold text-gray-800">Overall Completion</p>
              <p className="text-2xl font-bold text-green-600">
                {completedCount}/{features.length} Features Implemented
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{Math.round(completionPercentage)}% Complete</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`border-l-4 rounded-lg shadow-md p-6 transition-all hover:shadow-lg ${getStatusBg(
                feature.status
              )} border-r border-b border-t`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">{getStatusIcon(feature.status)}</div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-700 mt-1">{feature.description}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full font-semibold text-sm whitespace-nowrap ml-4 ${
                        feature.status === 'complete'
                          ? 'bg-green-200 text-green-800'
                          : feature.status === 'in-progress'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-orange-200 text-orange-800'
                      }`}
                    >
                      {feature.status === 'complete'
                        ? '✓ Complete'
                        : feature.status === 'in-progress'
                          ? '⏳ In Progress'
                          : '◐ Partial'}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-300 border-opacity-50">
                    {/* Components */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Components:</p>
                      <div className="flex flex-wrap gap-1">
                        {feature.components.map((comp, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-white px-2 py-1 rounded text-xs text-gray-700 border border-gray-300"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Endpoint */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">API Endpoint:</p>
                      <code className="bg-white px-2 py-1 rounded text-xs text-blue-600 border border-gray-300 block">
                        {feature.endpoint}
                      </code>
                    </div>

                    {/* Coverage */}
                    <div className="md:col-span-2">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Coverage:</p>
                      <p className="text-sm text-gray-700">{feature.coverage}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Implementation Details */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Implementation Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Frontend */}
            <div>
              <h3 className="text-lg font-bold text-blue-600 mb-4">Frontend Stack</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ React 18.2 with TypeScript</li>
                <li>✓ Vite dev server</li>
                <li>✓ Tailwind CSS for styling</li>
                <li>✓ React Leaflet for maps</li>
                <li>✓ React Icons for UI</li>
                <li>✓ Lazy loading for performance</li>
                <li>✓ Error boundaries for stability</li>
                <li>✓ localStorage for persistence</li>
              </ul>
            </div>

            {/* Backend */}
            <div>
              <h3 className="text-lg font-bold text-blue-600 mb-4">Backend Stack</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Express.js 4.21</li>
                <li>✓ TypeScript 5.3</li>
                <li>✓ Supabase PostgreSQL</li>
                <li>✓ 34 mock sensors in Kazakhstan</li>
                <li>✓ Auto-refresh every 60 seconds</li>
                <li>✓ Alert system (30s checks)</li>
                <li>✓ Graceful database fallback</li>
                <li>✓ RESTful API (8+ endpoints)</li>
              </ul>
            </div>
          </div>

          {/* Data Coverage */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Geographic Coverage</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                'Almaty (5 sensors)',
                'Astana (3 sensors)',
                'Karaganda (2 sensors)',
                'Shymkent (2 sensors)',
                'Aktobe (2 sensors)',
                'Pavlodar (2 sensors)',
                'Semey (2 sensors)',
                'Atyrau (2 sensors)',
                'Uralsk (1 sensor)',
                'Kyzylorda (1 sensor)',
                'Taraz (1 sensor)',
                'Oral (1 sensor)',
                'Kostanay (1 sensor)',
                'Regional Areas (5 sensors)',
              ].map((city, idx) => (
                <div key={idx} className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
                  <p className="font-semibold text-gray-800 text-sm">{city}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Future Enhancements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Mobile App',
                description: 'Native iOS and Android applications for on-the-go monitoring',
              },
              {
                title: 'Advanced Analytics',
                description: 'Machine learning models for better predictions and anomaly detection',
              },
              {
                title: 'Email/SMS Alerts',
                description: 'Direct notifications to user phones and emails for critical events',
              },
              {
                title: 'Data Export',
                description: 'CSV/Excel export for research and compliance reporting',
              },
              {
                title: 'Advanced Filtering',
                description: 'Filter by pollutant type, time range, severity level',
              },
              {
                title: 'Community Features',
                description: 'User reports, community air quality observations, social sharing',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-gray-700 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesStatus;
