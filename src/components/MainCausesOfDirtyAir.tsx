/**
 * Main Causes of Dirty Air Component
 * Educational section explaining the main sources of air pollution
 */

import React from 'react';
import { useLanguage } from '../i18n.js';

interface CauseCard {
  title: string;
  description: string;
  icon: string;
  color: string;
  percentage?: number;
}

const MainCausesOfDirtyAir: React.FC = () => {
  const { t } = useLanguage();
  const causes: CauseCard[] = [
    {
      title: t('causes.cards.vehicles.title'),
      description: t('causes.cards.vehicles.description'),
      icon: '🚗',
      color: 'bg-red-50',
      percentage: 40,
    },
    {
      title: t('causes.cards.heating.title'),
      description: t('causes.cards.heating.description'),
      icon: '🔥',
      color: 'bg-orange-50',
      percentage: 30,
    },
    {
      title: t('causes.cards.industry.title'),
      description: t('causes.cards.industry.description'),
      icon: '🏭',
      color: 'bg-yellow-50',
      percentage: 20,
    },
    {
      title: t('causes.cards.geo.title'),
      description: t('causes.cards.geo.description'),
      icon: '⛰️',
      color: 'bg-blue-50',
      percentage: 10,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">{t('causes.title')}</h2>
        <p className="text-gray-600 text-sm mt-2">{t('causes.subtitle')}</p>
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
                  <span className="text-xs text-gray-600">{t('causes.contribution')}</span>
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
        <p className="text-red-900 font-semibold mb-2">{t('causes.peakTitle')}</p>
        <p className="text-red-800 text-sm">
          {t('causes.peakBody')}
        </p>
      </div>
    </div>
  );
};

export default MainCausesOfDirtyAir;
