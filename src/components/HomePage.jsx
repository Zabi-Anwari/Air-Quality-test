import { useState, lazy, Suspense } from 'react';
import { FiMap, FiBarChart2, FiActivity } from 'react-icons/fi';
import { useLanguage } from '../i18n.js';

const AirQualityMap = lazy(() => import('./air-quality-map.tsx'));
const AQIDashboard = lazy(() => import('./AQIDashboard.tsx'));
const AQIHistoryChart = lazy(() => import('./AQIHistoryChart.tsx'));

const HomePage = () => {
  const { t } = useLanguage();
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedLocationIds, setSelectedLocationIds] = useState([1, 2]); // Share state

  const tabs = [
    { id: 'dashboard', label: t('home.tabs.dashboard'), icon: FiActivity },
    { id: 'map', label: t('home.tabs.map'), icon: FiMap },
    { id: 'charts', label: t('home.tabs.charts'), icon: FiBarChart2 },
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8 px-6">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActivePage(id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 transition-colors font-medium ${
                  activePage === id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <Suspense
        fallback={
          <div className="h-96 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('home.loading')}</p>
            </div>
          </div>
        }
      >
        {activePage === 'dashboard' && (
          <AQIDashboard 
            selectedLocationIds={selectedLocationIds} 
            onLocationChange={setSelectedLocationIds}
          />
        )}
        {activePage === 'map' && (
          <div className="h-[70vh] w-full">
            <AirQualityMap selectedLocationIds={selectedLocationIds} />
          </div>
        )}
        {activePage === 'charts' && (
          <div className="max-w-7xl mx-auto p-6">
            <AQIHistoryChart selectedLocationIds={selectedLocationIds} hoursBack={24} />
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default HomePage;
