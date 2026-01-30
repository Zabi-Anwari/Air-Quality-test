/**
 * Main Causes of Dirty Air Component
 * Educational section explaining the main sources of air pollution
 */

import React from 'react';

interface CauseCard {
  title: string;
  description: string;
  icon: string;
  color: string;
  percentage?: number;
}

const MainCausesOfDirtyAir: React.FC = () => {
  const causes: CauseCard[] = [
    {
      title: 'Vehicle emissions',
      description:
        'Nitrogen oxides and fine particulate matter (PM) from vehicles in the city are the biggest sources of pollution.',
      icon: '🚗',
      color: 'bg-red-50',
      percentage: 40,
    },
    {
      title: 'Individual heating',
      description:
        'The use of coal and cheap fuel in suburban homes during the winter releases harmful smoke and soot into the atmosphere.',
      icon: '🔥',
      color: 'bg-orange-50',
      percentage: 30,
    },
    {
      title: 'Industrial impact',
      description:
        'Emissions from local thermal power plants and industrial plants and heavy particulate matter (sulfur dioxide) affect air quality.',
      icon: '🏭',
      color: 'bg-yellow-50',
      percentage: 20,
    },
    {
      title: 'Geographical factor',
      description:
        'Almaty is surrounded by mountains creating an inversion layer in winter. Pollutants accumulate over the city and cannot disperse.',
      icon: '⛰️',
      color: 'bg-blue-50',
      percentage: 10,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">The main causes of dirty air</h2>
        <p className="text-gray-600 text-sm mt-2">Understanding the primary sources of pollution in urban areas</p>
      </div>

      {/* Causes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {causes.map((cause, index) => (
          <div
            key={index}
            className={`${cause.color} border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow`}
          >
            {/* Icon */}
            <div className="text-5xl mb-4">{cause.icon}</div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-800 mb-3">{cause.title}</h3>

            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed mb-4">{cause.description}</p>

            {/* Percentage Bar */}
            {cause.percentage && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-600">Contribution</span>
                  <span className="text-sm font-bold text-gray-800">{cause.percentage}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      index === 0
                        ? 'bg-red-500'
                        : index === 1
                          ? 'bg-orange-500'
                          : index === 2
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                    }`}
                    style={{ width: `${cause.percentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Info */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-900 font-semibold mb-2">🔴 Pollution Peak:</p>
        <p className="text-red-800 text-sm">
          The highest levels of pollution were observed at the beginning of the work week, reflecting the impact of
          traffic.
        </p>
      </div>
    </div>
  );
};

export default MainCausesOfDirtyAir;
