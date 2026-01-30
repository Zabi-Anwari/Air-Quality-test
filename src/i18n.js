const dictionary = {
  kk: {
    map: {
      quickHint: 'Жылдам тексеру үшін картаның кез келген жерін басыңыз.',
    },
  },
  en: {
    map: {
      quickHint: 'Click anywhere on the map for a quick check.',
    },
  },
};

const getFromPath = (locale, key) => {
  return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), dictionary[locale]);
};

export const t = (key, locale = 'kk') => {
  const localeValue = getFromPath(locale, key);
  if (localeValue !== undefined) return localeValue;
  const fallbackValue = getFromPath('en', key);
  return fallbackValue !== undefined ? fallbackValue : key;
};
