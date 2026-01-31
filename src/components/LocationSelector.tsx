/**
 * Location Selector Component
 * Allows users to select which cities/locations they want to monitor
 */

import React, { useState, useEffect } from 'react';
import { FiPlus, FiX, FiMapPin } from 'react-icons/fi';
import { useLanguage } from '../i18n.js';

interface Location {
  id: number;
  name: string;
  city: string;
  country: string;
  location_name?: string;
}

interface LocationSelectorProps {
  availableLocations: Location[];
  selectedLocationIds: number[];
  onSelectionChange: (locationIds: number[]) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  availableLocations,
  selectedLocationIds,
  onSelectionChange,
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedByCity, setGroupedByCity] = useState<{ [key: string]: Location[] }>({});

  useEffect(() => {
    // Group locations by city
    const grouped = availableLocations.reduce(
      (acc, location) => {
        if (!acc[location.city]) {
          acc[location.city] = [];
        }
        acc[location.city].push(location);
        return acc;
      },
      {} as { [key: string]: Location[] }
    );
    setGroupedByCity(grouped);
  }, [availableLocations]);

  const selectedLocations = availableLocations.filter((loc) => selectedLocationIds.includes(loc.id));

  const filteredLocations = availableLocations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleLocation = (locationId: number) => {
    if (selectedLocationIds.includes(locationId)) {
      onSelectionChange(selectedLocationIds.filter((id) => id !== locationId));
    } else {
      onSelectionChange([...selectedLocationIds, locationId]);
    }
  };

  const handleRemoveLocation = (locationId: number) => {
    onSelectionChange(selectedLocationIds.filter((id) => id !== locationId));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <FiMapPin className="text-blue-600" size={20} />
          {t('locationSelector.title')}
        </h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
        >
          <FiPlus size={16} />
          {t('locationSelector.addLocation')}
        </button>
      </div>

      {/* Selected Locations Tags */}
      {selectedLocations.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedLocations.map((loc) => (
            <div
              key={loc.id}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold"
            >
              <span>{loc.name}</span>
              <button
                onClick={() => handleRemoveLocation(loc.id)}
                className="hover:text-blue-900 transition-colors"
                title={t('locationSelector.remove')}
              >
                <FiX size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Location Count */}
      <p className="text-xs text-gray-600 mb-4">
        {t('locationSelector.monitoring')} {selectedLocations.length} {selectedLocations.length !== 1 ? t('locationSelector.locationPlural') : t('locationSelector.locationSingular')} {t('locationSelector.outOf')} {availableLocations.length}
      </p>

      {/* Location Picker Modal */}
      {isOpen && (
        <div className="border-t pt-4 mt-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder={t('locationSelector.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Location List by City */}
          <div className="max-h-64 overflow-y-auto space-y-3">
            {Object.entries(groupedByCity).map(([city, locations]) => {
              const filteredCityLocations = locations.filter(
                (loc) =>
                  loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  city.toLowerCase().includes(searchTerm.toLowerCase())
              );

              if (filteredCityLocations.length === 0) return null;

              return (
                <div key={city}>
                  <h4 className="text-xs font-bold text-gray-700 mb-2 text-blue-600">{city}</h4>
                  <div className="space-y-1 ml-2">
                    {filteredCityLocations.map((loc) => (
                      <label
                        key={loc.id}
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLocationIds.includes(loc.id)}
                          onChange={() => handleToggleLocation(loc.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{loc.name}</span>
                        <span className="text-xs text-gray-500">({loc.location_name || loc.country})</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full mt-3 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            {t('locationSelector.done')}
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
