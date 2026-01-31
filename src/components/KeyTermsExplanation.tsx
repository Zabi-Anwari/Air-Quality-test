/**
 * Key Terms Explanation Component
 * Educational section explaining air quality terms and pollutants
 */

import React from 'react';
import { useLanguage } from '../i18n.js';

interface TermCard {
  title: string;
  description: string;
  icon: string;
}

const KeyTermsExplanation: React.FC = () => {
  const { t } = useLanguage();
  const terms: TermCard[] = [
    {
      title: 'AQI',
      description: t('keyTerms.terms.aqi'),
      icon: '📊',
    },
    {
      title: 'PM2.5',
      description: t('keyTerms.terms.pm25'),
      icon: '💨',
    },
    {
      title: 'PM10',
      description: t('keyTerms.terms.pm10'),
      icon: '🌪️',
    },
    {
      title: 'NO₂',
      description: t('keyTerms.terms.no2'),
      icon: '🚗',
    },
    {
      title: 'O₃',
      description: t('keyTerms.terms.o3'),
      icon: '⚗️',
    },
    {
      title: 'CO',
      description: t('keyTerms.terms.co'),
      icon: '💨',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">{t('keyTerms.title')}</h2>
        <p className="text-gray-600 text-sm mt-2">{t('keyTerms.subtitle')}</p>
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
        <h3 className="font-bold text-blue-900 mb-2">{t('keyTerms.interpretTitle')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          <div className="bg-green-100 text-green-900 p-3 rounded font-semibold text-center">
            <div className="text-xs">0-50</div>
            <div>{t('keyTerms.interpret.good')}</div>
          </div>
          <div className="bg-yellow-100 text-yellow-900 p-3 rounded font-semibold text-center">
            <div className="text-xs">51-100</div>
            <div>{t('keyTerms.interpret.moderate')}</div>
          </div>
          <div className="bg-orange-100 text-orange-900 p-3 rounded font-semibold text-center">
            <div className="text-xs">101-150</div>
            <div>{t('keyTerms.interpret.sensitive')}</div>
          </div>
          <div className="bg-red-100 text-red-900 p-3 rounded font-semibold text-center">
            <div className="text-xs">151-200</div>
            <div>{t('keyTerms.interpret.unhealthy')}</div>
          </div>
          <div className="bg-purple-100 text-purple-900 p-3 rounded font-semibold text-center">
            <div className="text-xs">201+</div>
            <div>{t('keyTerms.interpret.hazardous')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyTermsExplanation;
