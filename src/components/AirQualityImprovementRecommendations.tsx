/**
 * Air Quality Improvement Recommendations Component
 * Section showing what can be done to improve air quality
 */

import React from 'react';
import { useLanguage } from '../i18n.js';

interface RecommendationCard {
  title: string;
  description: string;
  icon: string;
  tips: string[];
}

const AirQualityImprovementRecommendations: React.FC = () => {
  const { t } = useLanguage();
  const recommendations: RecommendationCard[] = [
    {
      title: t('recommendations.cards.transport.title'),
      description: t('recommendations.cards.transport.description'),
      icon: '🚶',
      tips: t('recommendations.cards.transport.tips'),
    },
    {
      title: t('recommendations.cards.energy.title'),
      description: t('recommendations.cards.energy.description'),
      icon: '💡',
      tips: t('recommendations.cards.energy.tips'),
    },
    {
      title: t('recommendations.cards.informed.title'),
      description: t('recommendations.cards.informed.description'),
      icon: '📱',
      tips: t('recommendations.cards.informed.tips'),
    },
    {
      title: t('recommendations.cards.policy.title'),
      description: t('recommendations.cards.policy.description'),
      icon: '🤝',
      tips: t('recommendations.cards.policy.tips'),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">{t('recommendations.title')}</h2>
        <p className="text-gray-600 text-sm mt-2">{t('recommendations.subtitle')}</p>
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
              <p className="text-xs font-bold text-gray-700 uppercase">{t('recommendations.howTo')}</p>
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
            <h3 className="text-lg font-bold text-gray-800 mb-2">{t('recommendations.cta.title')}</h3>
            <p className="text-gray-700 mb-3">{t('recommendations.cta.body')}</p>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
              {t('recommendations.cta.button')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQualityImprovementRecommendations;
