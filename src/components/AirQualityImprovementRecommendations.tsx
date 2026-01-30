/**
 * Air Quality Improvement Recommendations Component
 * Section showing what can be done to improve air quality
 */

import React from 'react';

interface RecommendationCard {
  title: string;
  description: string;
  icon: string;
  tips: string[];
}

const AirQualityImprovementRecommendations: React.FC = () => {
  const recommendations: RecommendationCard[] = [
    {
      title: 'Public transportation / Walking',
      description: 'Reduce your use of private vehicles within the city as much as possible. This will immediately reduce emissions.',
      icon: '🚶',
      tips: [
        'Use public buses and metro systems',
        'Carpool with coworkers',
        'Cycle or walk short distances',
        'Support car-free city initiatives',
      ],
    },
    {
      title: 'Energy saving',
      description:
        'Take steps to save energy at home. Efficient use of heat reduces the demand for coal-fired power generation.',
      icon: '💡',
      tips: [
        'Insulate your home properly',
        'Use energy-efficient appliances',
        'Switch to renewable energy sources',
        'Reduce unnecessary heating in winter',
      ],
    },
    {
      title: 'Stay informed',
      description:
        'Regularly check your air quality with this dashboard and limit your exposure to the sun in the morning.',
      icon: '📱',
      tips: [
        'Check AQI before outdoor activities',
        'Wear protective masks during high pollution',
        'Plan outdoor exercise during low-pollution periods',
        'Share air quality information with family',
      ],
    },
    {
      title: 'Support policy changes',
      description:
        'Support government initiatives aimed at improving air quality, such as emissions standards and green spaces.',
      icon: '🤝',
      tips: [
        'Vote for environmental policies',
        'Participate in community clean-up events',
        'Support tree-planting initiatives',
        'Advocate for stricter emission regulations',
      ],
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">What can be done to improve air quality?</h2>
        <p className="text-gray-600 text-sm mt-2">Individual and collective actions to create cleaner air</p>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`rounded-lg p-6 border-t-4 hover:shadow-lg transition-shadow ${
              index === 0
                ? 'bg-blue-50 border-blue-500'
                : index === 1
                  ? 'bg-yellow-50 border-yellow-500'
                  : index === 2
                    ? 'bg-green-50 border-green-500'
                    : 'bg-purple-50 border-purple-500'
            }`}
          >
            {/* Icon */}
            <div className="text-5xl mb-4">{rec.icon}</div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-800 mb-2">{rec.title}</h3>

            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed mb-4">{rec.description}</p>

            {/* Tips List */}
            <div className="space-y-2 pt-4 border-t border-gray-300">
              <p className="text-xs font-bold text-gray-700 uppercase">How to:</p>
              <ul className="space-y-1">
                {rec.tips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                    <span className="text-lg leading-none mt-0.5">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0">🌍</div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Together We Can Make a Difference</h3>
            <p className="text-gray-700 mb-3">
              Air quality improvement is a collective responsibility. Every individual action contributes to creating a healthier
              environment for everyone. Start with small changes today and inspire others to do the same.
            </p>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
              Learn More About Air Quality
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQualityImprovementRecommendations;
