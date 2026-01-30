/**
 * Key Terms Explanation Component
 * Educational section explaining air quality terms and pollutants
 */

import React from 'react';

interface TermCard {
  title: string;
  description: string;
  icon: string;
}

const KeyTermsExplanation: React.FC = () => {
  const terms: TermCard[] = [
    {
      title: 'AQI',
      description: 'Air Quality Index. This is a numerical scale that indicates how clean or polluted the air is. Ranges from 0 (best) to 500+ (worst).',
      icon: '📊',
    },
    {
      title: 'PM2.5',
      description: 'Fine particles with a diameter of less than 2.5 micrometers. These can penetrate deep into the lungs and pose serious health risks.',
      icon: '💨',
    },
    {
      title: 'PM10',
      description: 'Particles less than 10 micrometers. Often caused by construction dust and road dust. Can affect breathing and visibility.',
      icon: '🌪️',
    },
    {
      title: 'NO₂',
      description: 'Nitrogen Dioxide. A reddish-brown gas produced mainly by vehicles and power plants. Can cause respiratory issues.',
      icon: '🚗',
    },
    {
      title: 'O₃',
      description: 'Ozone. A harmful air pollutant at ground level, especially for people with respiratory conditions. Can damage the respiratory system.',
      icon: '⚗️',
    },
    {
      title: 'CO',
      description: 'Carbon Monoxide. A colorless, odorless gas produced by vehicle emissions and combustion. Can be harmful at high concentrations.',
      icon: '💨',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Explanation of key terms</h2>
        <p className="text-gray-600 text-sm mt-2">Understanding air quality metrics and pollutants</p>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {terms.map((term, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-100 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            {/* Icon */}
            <div className="text-4xl mb-3">{term.icon}</div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-800 mb-2">{term.title}</h3>

            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed">{term.description}</p>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h3 className="font-bold text-blue-900 mb-2">📚 How to interpret AQI values:</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          <div className="bg-green-100 text-green-900 p-3 rounded font-semibold text-center">
            <div className="text-xs">0-50</div>
            <div>Good</div>
          </div>
          <div className="bg-yellow-100 text-yellow-900 p-3 rounded font-semibold text-center">
            <div className="text-xs">51-100</div>
            <div>Moderate</div>
          </div>
          <div className="bg-orange-100 text-orange-900 p-3 rounded font-semibold text-center">
            <div className="text-xs">101-150</div>
            <div>Sensitive</div>
          </div>
          <div className="bg-red-100 text-red-900 p-3 rounded font-semibold text-center">
            <div className="text-xs">151-200</div>
            <div>Unhealthy</div>
          </div>
          <div className="bg-purple-100 text-purple-900 p-3 rounded font-semibold text-center">
            <div className="text-xs">201+</div>
            <div>Hazardous</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyTermsExplanation;
