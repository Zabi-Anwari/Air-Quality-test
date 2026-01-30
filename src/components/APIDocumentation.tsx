/**
 * API Documentation Component
 * Comprehensive documentation of all available REST API endpoints
 * For developers integrating ICPAIR data
 */

import React, { useState } from 'react';
import { FiCode, FiCopy, FiCheck } from 'react-icons/fi';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters: { name: string; type: string; required: boolean; description: string }[];
  exampleResponse: string;
  useCase: string;
}

const APIDocumentation: React.FC = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string>('');

  const endpoints: Endpoint[] = [
    {
      method: 'GET',
      path: '/api/aqi/current',
      description: 'Get current AQI readings for all sensors or a specific sensor',
      parameters: [
        { name: 'sensorId', type: 'number', required: false, description: 'Optional: Get data for specific sensor' },
      ],
      exampleResponse: JSON.stringify({
        sensor_id: 1,
        device_id: 'SENSOR_ALM_001',
        site: 'Almaty Downtown',
        current_aqi: 85,
        dominant_pollutant: 'PM2.5',
        aqi_category: 'Moderate',
        aqi_color: '#FFA500',
        pollutants: {
          pm25: 45,
          pm10: 65,
          no2: 25,
          co: 15,
          o3: 10,
        },
        timestamp: '2024-01-28T10:30:00Z',
      }, null, 2),
      useCase: 'Real-time air quality dashboard, location selection, live alerts',
    },
    {
      method: 'GET',
      path: '/api/aqi/history',
      description: 'Get historical AQI data for a specific sensor with time range',
      parameters: [
        { name: 'sensorId', type: 'number', required: true, description: 'Sensor ID' },
        { name: 'hours', type: 'number', required: false, description: 'Hours back (default: 24)' },
        { name: 'limit', type: 'number', required: false, description: 'Max records (default: 100)' },
      ],
      exampleResponse: JSON.stringify({
        data: [
          {
            timestamp: '2024-01-28T10:00:00Z',
            aqi_overall: 82,
            pm25_aqi: 42,
            pm10_aqi: 63,
            category: 'Moderate',
            color: '#FFA500',
          },
        ],
      }, null, 2),
      useCase: 'Historical trend analysis, charts, long-term pollution patterns',
    },
    {
      method: 'GET',
      path: '/api/aqi/stats',
      description: 'Get statistical analysis of AQI data for a sensor',
      parameters: [
        { name: 'sensorId', type: 'number', required: true, description: 'Sensor ID' },
        { name: 'hours', type: 'number', required: false, description: 'Hours back (default: 24)' },
      ],
      exampleResponse: JSON.stringify({
        min_aqi: 45,
        max_aqi: 156,
        avg_aqi: 87,
        stddev: 28,
        total_records: 24,
      }, null, 2),
      useCase: 'Statistics dashboard, trend indicators, air quality summaries',
    },
    {
      method: 'GET',
      path: '/api/alerts/active',
      description: 'Get all currently active alerts across all sensors',
      parameters: [],
      exampleResponse: JSON.stringify({
        alerts: [
          {
            id: 1,
            sensor_id: 1,
            alert_type: 'threshold',
            severity: 'high',
            message: 'AQI exceeded 150 threshold',
            is_active: true,
            created_at: '2024-01-28T10:15:00Z',
          },
        ],
      }, null, 2),
      useCase: 'Real-time alert notifications, emergency notifications, health warnings',
    },
    {
      method: 'GET',
      path: '/api/alerts/history',
      description: 'Get historical alerts for a specific sensor',
      parameters: [
        { name: 'sensorId', type: 'number', required: true, description: 'Sensor ID' },
        { name: 'limit', type: 'number', required: false, description: 'Max records (default: 50)' },
      ],
      exampleResponse: JSON.stringify({
        alerts: [
          {
            id: 1,
            sensor_id: 1,
            alert_type: 'threshold',
            severity: 'high',
            message: 'AQI exceeded 150',
            created_at: '2024-01-28T08:00:00Z',
            resolved_at: '2024-01-28T10:00:00Z',
          },
        ],
      }, null, 2),
      useCase: 'Alert history, past incidents, compliance documentation',
    },
    {
      method: 'GET',
      path: '/api/forecast/:sensorId',
      description: 'Get predicted AQI for the next 6 hours',
      parameters: [
        { name: 'sensorId', type: 'number', required: true, description: 'Sensor ID (in URL)' },
      ],
      exampleResponse: JSON.stringify({
        forecasts: [
          {
            forecast_hour: 1,
            predicted_aqi: 92,
            confidence: 0.85,
            valid_at: '2024-01-28T11:30:00Z',
          },
        ],
      }, null, 2),
      useCase: 'Next-day planning, health decisions, outdoor activity planning',
    },
    {
      method: 'GET',
      path: '/api/sensors',
      description: 'Get list of all available sensors',
      parameters: [],
      exampleResponse: JSON.stringify({
        sensors: [
          {
            id: 1,
            device_id: 'SENSOR_ALM_001',
            name: 'Almaty Downtown',
            city: 'Almaty',
            latitude: 43.2381,
            longitude: 76.9453,
            country: 'Kazakhstan',
          },
        ],
      }, null, 2),
      useCase: 'Location discovery, map initialization, sensor availability',
    },
    {
      method: 'GET',
      path: '/api/sensors/:id/health',
      description: 'Get health status of a specific sensor',
      parameters: [
        { name: 'id', type: 'number', required: true, description: 'Sensor ID (in URL)' },
      ],
      exampleResponse: JSON.stringify({
        sensor_id: 1,
        last_reading: '2024-01-28T10:30:00Z',
        status: 'active',
        battery_level: 87,
        signal_strength: 'strong',
        last_sync: '2024-01-28T10:30:00Z',
      }, null, 2),
      useCase: 'Sensor monitoring, maintenance alerts, data reliability',
    },
  ];

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(''), 2000);
  };

  const methodColors = {
    GET: 'bg-blue-100 text-blue-800',
    POST: 'bg-green-100 text-green-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <FiCode size={40} className="text-blue-600" />
            REST API Documentation
          </h1>
          <p className="text-xl text-gray-600">
            Complete API reference for integrating ICPAIR air quality data
          </p>
        </div>

        {/* Base URL Info */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-12">
          <p className="font-semibold text-gray-800 mb-2">Base URL</p>
          <code className="bg-white p-3 rounded block text-sm font-mono">
            http://localhost:5000/api
          </code>
          <p className="text-sm text-gray-600 mt-2">
            Or in production: https://your-domain.com/api
          </p>
        </div>

        {/* Authentication Info */}
        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg mb-12">
          <p className="font-semibold text-gray-800 mb-2">Authentication</p>
          <p className="text-gray-700">
            Currently, no authentication is required for read operations. For production, implement API keys or OAuth2.
          </p>
        </div>

        {/* Endpoints */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Endpoints</h2>

          {endpoints.map((endpoint, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              {/* Header */}
              <div className="bg-gray-50 p-6 border-b border-gray-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded font-bold text-sm ${methodColors[endpoint.method]}`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono text-gray-700 bg-white px-3 py-1 rounded border border-gray-200">
                        {endpoint.path}
                      </code>
                    </div>
                    <p className="text-gray-700">{endpoint.description}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(endpoint.path, endpoint.path)}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                  >
                    {copiedEndpoint === endpoint.path ? (
                      <>
                        <FiCheck size={16} className="text-green-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <FiCopy size={16} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Parameters */}
                {endpoint.parameters.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Parameters</h4>
                    <div className="bg-gray-50 rounded overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Name</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Type</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Required</th>
                            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.parameters.map((param, pIdx) => (
                            <tr key={pIdx} className="border-t border-gray-200 hover:bg-white">
                              <td className="px-4 py-2 font-mono text-blue-600">{param.name}</td>
                              <td className="px-4 py-2 text-gray-600">{param.type}</td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${param.required ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-700'}`}>
                                  {param.required ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-gray-600">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Example Response */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Example Response</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-xs font-mono">
                    {endpoint.exampleResponse}
                  </pre>
                </div>

                {/* Use Case */}
                <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-800">Use Cases: </span>
                    {endpoint.useCase}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Integration Examples */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Integration Examples</h2>

          <div className="space-y-6">
            {/* JavaScript/Fetch Example */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">JavaScript (Fetch API)</h4>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-xs font-mono">
{`fetch('http://localhost:5000/api/aqi/current?sensorId=1')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`}
              </pre>
            </div>

            {/* Python Example */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Python (Requests)</h4>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-xs font-mono">
{`import requests

response = requests.get('http://localhost:5000/api/aqi/current', 
                       params={'sensorId': 1})
data = response.json()
print(data)`}
              </pre>
            </div>

            {/* cURL Example */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">cURL</h4>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-xs font-mono">
{`curl "http://localhost:5000/api/aqi/current?sensorId=1" \\
  -H "Content-Type: application/json"`}
              </pre>
            </div>
          </div>
        </div>

        {/* Error Handling */}
        <div className="mt-12 bg-red-50 border-l-4 border-red-600 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-red-900 mb-4">Error Handling</h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <span className="font-semibold">404 Not Found:</span> Sensor ID not found or endpoint doesn't exist
            </p>
            <p>
              <span className="font-semibold">400 Bad Request:</span> Missing required parameters or invalid data
            </p>
            <p>
              <span className="font-semibold">500 Server Error:</span> Internal server error; the app will return mock data as fallback
            </p>
          </div>
        </div>

        {/* Rate Limiting & Best Practices */}
        <div className="mt-12 bg-green-50 border-l-4 border-green-600 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-green-900 mb-4">Best Practices</h2>
          <ul className="space-y-2 text-gray-700 list-disc list-inside">
            <li>Cache responses for 60 seconds to reduce server load</li>
            <li>Implement exponential backoff for retries on failures</li>
            <li>Use pagination for large datasets</li>
            <li>Store API keys securely on the backend, never in frontend code</li>
            <li>Monitor API usage to detect anomalies</li>
            <li>Subscribe to alerts for maintenance windows</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentation;
