import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const dictionary = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      language: 'Language',
      languages: {
        en: 'English',
        kk: 'Қазақша',
        ru: 'Русский',
      },
    },
    home: {
      tabs: {
        dashboard: 'Dashboard',
        map: 'Map View',
        charts: 'Historical Charts',
      },
      loading: 'Loading...',
    },
    app: {
      loading: 'Loading...',
    },
    about: {
      mission: {
        title: 'Our Mission',
        lead: 'ICPAIR is a digital portal that provides real-time and historical environmental data for Almaty and the people of Kazakhstan.',
        body: 'Our goal is to increase transparency and help people make informed decisions about air quality. We use technology to promote environmental responsibility.',
        alt: 'Mission illustration',
      },
      parallax: {
        title: 'Together for a cleaner future!',
      },
      values: {
        title: 'Our Core Values',
        transparency: {
          title: 'Data transparency',
          description: 'We always present information accurately, clearly, and in a way that is accessible to everyone.',
        },
        impact: {
          title: 'Environmental impact',
          description: 'Our main purpose is to drive positive change for cleaner air.',
        },
        innovation: {
          title: 'Innovation',
          description: 'We use the latest technologies for visualization and forecasting.',
        },
      },
      tech: {
        title: 'Technology Platform and Data Sources',
        satellite: {
          title: 'Satellite data',
          description: 'ICPAIR uses Copernicus Sentinel-5P satellite imagery to monitor concentrations of pollutants (NO2, SO2).',
        },
        ground: {
          title: 'Ground sensors',
          description: 'Combining official and private sensor networks to get real-time local readings for fine particles such as PM2.5 and PM10 in Almaty.',
        },
        ai: {
          title: 'AI data processing',
          description: 'ICPAIR uses machine learning models to generate reliable forecasts and historical trends.',
        },
      },
      collab: {
        title: 'Work with us',
        lead: 'ICPAIR is still evolving. We invite you to support the project with data, technology, or volunteering.',
        volunteer: {
          title: 'Volunteer',
          description: 'Help install sensors or organize community events.',
        },
        developers: {
          title: 'Developers',
          description: 'Contribute to our open-source API and build new visualizations.',
        },
        partner: {
          title: 'Partner with us',
          description: 'Support the project through your organization’s environmental programs.',
        },
      },
    },
    services: {
      hero: {
        titlePrefix: 'ICPAIR Core',
        titleHighlight: 'Services',
        subtitle: 'We use advanced technologies to collect, process, and deliver critical air-quality insights.',
      },
      list: {
        realtime: {
          title: 'Real-time monitoring',
          description: 'Access continuous real-time PM2.5, PM10, and AQI data across Almaty’s key areas, visualized on the map.',
        },
        history: {
          title: 'Historical analysis',
          description: 'Download and analyze historical data to identify long-term trends, seasonal changes, and high-risk periods.',
        },
        forecast: {
          title: 'Predictive modeling',
          description: 'Get air-quality forecasts for tomorrow and next week powered by AI-based models to support health decisions.',
        },
        visualization: {
          title: 'Interactive visualization',
          description: 'Understand complex information through tables, charts, and heatmap-style visualizations.',
        },
        alerts: {
          title: 'Alerts & notifications',
          description: 'Receive warnings when air quality reaches or is forecasted to reach hazardous levels.',
        },
        api: {
          title: 'API integration (for developers)',
          description: 'Use our open API to integrate ICPAIR data into your apps, research, or other projects.',
        },
      },
      sensor: {
        title: 'Buy Air Quality Monitoring Sensors',
        subtitle: 'Monitor your home or office air quality in real time. Our sensors connect directly to the ICPAIR platform.',
        buy: 'Buy',
        products: {
          basic: {
            title: 'Basic home sensor',
            features: ['PM2.5 measurement', 'Indoor temperature', 'Wi‑Fi connectivity', 'Mobile app support'],
            price: '15,000 KZT',
          },
          standard: {
            title: 'Standard outdoor sensor',
            features: ['PM2.5 and PM10 measurement', 'Outdoor enclosure (IP65)', 'AQI reporting', 'Cloud storage'],
            price: '45,000 KZT',
          },
          pro: {
            title: 'Professional station',
            features: ['PM2.5, PM10, SO2, NO2 measurement', 'Meteorological sensors (Temperature, Humidity)', 'GPS geolocation', 'Connect to ICPAIR data network'],
            price: '150,000 KZT',
          },
          business: {
            title: 'Business package (3 stations)',
            features: ['3 Professional stations', 'Corporate API access', 'Custom analytics reports', '24/7 Technical support'],
            price: '400,000 KZT',
          },
        },
      },
      cta: {
        title: 'Ready to use your data?',
        body: 'Contact us to learn more about using our API or partnering on air-quality monitoring programs.',
        button: 'Contact us',
        alert: "The contact form opens here or navigates to the 'About' page.",
      },
    },
    common: {
      aqi: 'AQI',
      overallAqi: 'Overall AQI',
      time: 'Time',
      location: 'Location',
      category: 'Category',
      confidence: 'Confidence',
      updated: 'Updated',
      loading: 'Loading...',
      notAvailable: 'N/A',
      none: '—',
      lastUpdated: 'Last updated',
      never: 'Never',
    },
    pollutants: {
      pm1: 'PM1',
      pm25: 'PM2.5',
      pm10: 'PM10',
      no2: 'NO₂',
      co: 'CO',
      o3: 'O₃',
      so2: 'SO₂',
      co2: 'CO₂',
      voc: 'VOC',
      temp: 'Temp',
      humidity: 'Humidity',
      ch2o: 'CH2O',
    },
    aqiCategories: {
      good: 'Good',
      moderate: 'Moderate',
      sensitive: 'Unhealthy for Sensitive Groups',
      unhealthy: 'Unhealthy',
      veryUnhealthy: 'Very Unhealthy',
      hazardous: 'Hazardous',
      unknown: 'Unknown',
    },
    dashboard: {
      title: 'Air Quality Intelligence',
      subtitle: 'Real-time monitoring and forecasting platform',
      refresh: 'Refresh',
      healthRecTitle: 'Health Recommendation',
      dominant: 'Dominant',
      pollutantLevels: 'Pollutant Levels (µg/m³)',
      limitedPollutants: 'This data source only provides limited pollutant details. Additional pollutants may be unavailable.',
      nextHours: 'Next 6 Hours',
      loadingForecast: 'Loading forecast...',
      criticalAlerts: 'Critical Alerts',
      activeAlerts: 'Active Alerts',
      footerNote: 'Real-time air quality monitoring for multiple sensors',
    },
    healthRecommendations: {
      good: '✓ Good air quality - Outdoor activities recommended',
      moderate: '◐ Acceptable air quality - Most can enjoy outdoor activities',
      sensitive: '△ Sensitive groups should limit outdoor exertion',
      unhealthy: '⚠ Unhealthy - Limit outdoor activities',
      veryUnhealthy: '⚠⚠ Very Unhealthy - Avoid outdoor activities',
      hazardous: '⚠⚠⚠ Hazardous - Stay indoors',
    },
    history: {
      title: 'Historical Trends & Analysis',
      subtitlePrefix: 'View detailed historical data for selected locations over the past',
      range: {
        h6: '6 hours',
        h12: '12 hours',
        h24: '24 hours',
        d3: '3 days',
        d7: '7 days',
      },
      timePeriod: 'Time Period:',
      selectLocation: 'Select Location:',
      loadingChart: 'Loading chart data...',
      noData: 'No data available',
      min: 'Minimum',
      max: 'Maximum',
      avg: 'Average',
      stdDev: 'Std Dev',
      displayPollutants: 'Display Pollutants:',
      locationFallback: 'Location',
    },
    akiReview: {
      title: 'AKI Review (Max 150)',
      subtitle: 'Comparison of Air Quality Index across locations',
      table: {
        location: 'Location',
        aqi: 'AQI',
        pm25: 'PM2.5',
        status: 'Status',
      },
    },
    weeklyTrends: {
      title: 'Trends in the last week (Average AKI)',
      averageLabel: 'Average',
      insightTitle: '💡 Insight:',
      insightBody: 'The highest levels of pollution were observed at the beginning of the work week, reflecting the impact of traffic. Weekends show significantly cleaner air.',
      days: {
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thu: 'Thu',
        fri: 'Fri',
        sat: 'Sat',
        sun: 'Sun',
      },
    },
    keyTerms: {
      title: 'Explanation of key terms',
      subtitle: 'Understanding air quality metrics and pollutants',
      terms: {
        aqi: 'Air Quality Index. This is a numerical scale that indicates how clean or polluted the air is. Ranges from 0 (best) to 500+ (worst).',
        pm25: 'Fine particles with a diameter of less than 2.5 micrometers. These can penetrate deep into the lungs and pose serious health risks.',
        pm10: 'Particles less than 10 micrometers. Often caused by construction dust and road dust. Can affect breathing and visibility.',
        no2: 'Nitrogen Dioxide. A reddish-brown gas produced mainly by vehicles and power plants. Can cause respiratory issues.',
        o3: 'Ozone. A harmful air pollutant at ground level, especially for people with respiratory conditions. Can damage the respiratory system.',
        co: 'Carbon Monoxide. A colorless, odorless gas produced by vehicle emissions and combustion. Can be harmful at high concentrations.',
      },
      interpretTitle: '📚 How to interpret AQI values:',
      interpret: {
        good: 'Good',
        moderate: 'Moderate',
        sensitive: 'Sensitive',
        unhealthy: 'Unhealthy',
        hazardous: 'Hazardous',
      },
    },
    causes: {
      title: 'The main causes of dirty air',
      subtitle: 'Understanding the primary sources of pollution in urban areas',
      contribution: 'Contribution',
      cards: {
        vehicles: {
          title: 'Vehicle emissions',
          description: 'Nitrogen oxides and fine particulate matter (PM) from vehicles in the city are the biggest sources of pollution.',
        },
        heating: {
          title: 'Individual heating',
          description: 'The use of coal and cheap fuel in suburban homes during the winter releases harmful smoke and soot into the atmosphere.',
        },
        industry: {
          title: 'Industrial impact',
          description: 'Emissions from local thermal power plants and industrial plants and heavy particulate matter (sulfur dioxide) affect air quality.',
        },
        geo: {
          title: 'Geographical factor',
          description: 'Almaty is surrounded by mountains creating an inversion layer in winter. Pollutants accumulate over the city and cannot disperse.',
        },
      },
      peakTitle: '🔴 Pollution Peak:',
      peakBody: 'The highest levels of pollution were observed at the beginning of the work week, reflecting the impact of traffic.',
    },
    recommendations: {
      title: 'What can be done to improve air quality?',
      subtitle: 'Individual and collective actions to create cleaner air',
      howTo: 'How to:',
      cards: {
        transport: {
          title: 'Public transportation / Walking',
          description: 'Reduce your use of private vehicles within the city as much as possible. This will immediately reduce emissions.',
          tips: [
            'Use public buses and metro systems',
            'Carpool with coworkers',
            'Cycle or walk short distances',
            'Support car-free city initiatives',
          ],
        },
        energy: {
          title: 'Energy saving',
          description: 'Take steps to save energy at home. Efficient use of heat reduces the demand for coal-fired power generation.',
          tips: [
            'Insulate your home properly',
            'Use energy-efficient appliances',
            'Switch to renewable energy sources',
            'Reduce unnecessary heating in winter',
          ],
        },
        informed: {
          title: 'Stay informed',
          description: 'Regularly check your air quality with this dashboard and limit your exposure to the sun in the morning.',
          tips: [
            'Check AQI before outdoor activities',
            'Wear protective masks during high pollution',
            'Plan outdoor exercise during low-pollution periods',
            'Share air quality information with family',
          ],
        },
        policy: {
          title: 'Support policy changes',
          description: 'Support government initiatives aimed at improving air quality, such as emissions standards and green spaces.',
          tips: [
            'Vote for environmental policies',
            'Participate in community clean-up events',
            'Support tree-planting initiatives',
            'Advocate for stricter emission regulations',
          ],
        },
      },
      cta: {
        title: 'Together We Can Make a Difference',
        body: 'Air quality improvement is a collective responsibility. Every individual action contributes to creating a healthier environment for everyone. Start with small changes today and inspire others to do the same.',
        button: 'Learn More About Air Quality',
      },
    },
    locationSelector: {
      title: 'Monitor Locations',
      addLocation: 'Add Location',
      remove: 'Remove',
      monitoring: 'Monitoring',
      locationSingular: 'location',
      locationPlural: 'locations',
      outOf: 'out of',
      searchPlaceholder: 'Search locations or cities...',
      done: 'Done',
    },
    forecast: {
      unavailable: 'Forecast Unavailable',
      noDataTitle: '7-Day Air Quality Forecast',
      noDataBody: 'No forecast data available for this sensor.',
      title: '3-Day Air Quality Forecast',
      nextDays: 'Next 3 days',
      updatedLabel: 'Updated',
    },
    footer: {
      about: {
        body: 'ICPAIR monitors air quality in real time. Pollution levels, forecasts, and analytics for city residents.',
        copy: '© 2025 ICPAIR. All rights reserved. 🌍💙',
      },
      social: {
        title: 'We are on social media:',
        instagram: 'Instagram',
        telegram: 'Telegram',
      },
      contacts: {
        title: 'Contact:',
      },
    },
    map: {
      quickHint: 'Click anywhere on the map for a quick check.',
      loading: 'Loading sensor data...',
      locationLabel: 'Location',
      timeLabel: 'Time',
      noReading: 'No reading available.',
    },
  },
  kk: {
    nav: {
      home: 'Басты бет',
      about: 'Біз туралы',
      services: 'Қызметтер',
      language: 'Тіл',
      languages: {
        en: 'English',
        kk: 'Қазақша',
        ru: 'Русский',
      },
    },
    home: {
      tabs: {
        dashboard: 'Бақылау тақтасы',
        map: 'Карта көрінісі',
        charts: 'Тарихи графиктер',
      },
      loading: 'Жүктелуде...',
    },
    app: {
      loading: 'Жүктелуде...',
    },
    about: {
      mission: {
        title: 'Біздің Миссиямыз',
        lead: 'ICPAIR — бұл Алматы қаласы мен Қазақстан азаматтарын нақты уақыттағы және тарихи экологиялық деректермен қамтамасыз ететін цифрлық портал.',
        body: 'Біздің мақсатымыз — ашықтықты арттыру және ауа сапасына қатысты мәселелер бойынша саналы шешім қабылдауға көмектесу. Біз экологиялық жауапкершілікті ілгерілету үшін технологияны қолданамыз.',
        alt: 'Миссия иллюстрациясы',
      },
      parallax: {
        title: 'Бірге таза болашаққа!',
      },
      values: {
        title: 'Негізгі Құндылықтарымыз',
        transparency: {
          title: 'Деректердің ашықтығы',
          description: 'Біз әрқашан ақпаратты дәл, түсінікті және барлығына қолжетімді етіп ұсынамыз.',
        },
        impact: {
          title: 'Экологиялық әсер',
          description: 'Біздің жұмысымыздың негізгі міндеті — таза ауа үшін оң өзгерістерге ықпал ету.',
        },
        innovation: {
          title: 'Инновация',
          description: 'Біз деректерді визуализациялау және болжау үшін ең жаңа технологияларды қолданамыз.',
        },
      },
      tech: {
        title: 'Технологиялық Тұғырнама және Дереккөздері',
        satellite: {
          title: 'Спутниктік Деректер',
          description: 'Ластаушы заттардың (NO2, SO2) жалпы концентрациясын бақылау үшін ICPAIR Copernicus Sentinel-5P спутниктік суреттерін пайдаланады.',
        },
        ground: {
          title: 'Жерүсті Сенсорлары',
          description: 'Алматыдағы PM2.5 және PM10 сияқты ұсақ бөлшектердің жергілікті, нақты уақыттағы көрсеткіштерін алу үшін ресми және жеке сенсор желілерін біріктіру.',
        },
        ai: {
          title: 'AI Деректерді Өңдеу',
          description: 'Нақты және сенімді болжамдар мен тарихи трендтерді (көрсеткіштерді) жасау үшін ICPAIR Machine Learning (Машиналық оқыту) модельдерін пайдаланады.',
        },
      },
      collab: {
        title: 'Бізбен бірге жұмыс істеңіз',
        lead: 'ICPAIR әлі де даму үстінде. Біздің жобамызды деректермен, технологиямен немесе ерікті көмекпен қолдауға шақырамыз.',
        volunteer: {
          title: 'Ерікті болыңыз',
          description: 'Сенсорлар орнатуға немесе қауымдастық іс-шараларын өткізуге көмектесіңіз.',
        },
        developers: {
          title: 'Әзірлеушілер',
          description: 'Біздің ашық бастапқы кодқа (API) үлес қосыңыз және жаңа визуализацияларды жасаңыз.',
        },
        partner: {
          title: 'Серіктес болыңыз',
          description: 'Ұйымыңыздың экологиялық бағдарламалары арқылы біздің жобамызды қолдаңыз.',
        },
      },
    },
    services: {
      hero: {
        titlePrefix: 'ICPAIR Негізгі',
        titleHighlight: 'Қызметтері',
        subtitle: 'Біз ауа сапасына қатысты маңызды ақпаратты жинау, өңдеу және ұсыну үшін ең озық технологияларды қолданамыз.',
      },
      list: {
        realtime: {
          title: 'Нақты уақыттағы деректер мониторингі',
          description: 'Алматының төрт негізгі аймағы бойынша PM2.5, PM10 және АҚИ көрсеткіштерінің үздіксіз, нақты уақыттағы деректеріне қол жеткізіңіз. Барлық деректер геокартада визуализацияланған.',
        },
        history: {
          title: 'Тарихи деректерді талдау',
          description: 'Ауа сапасының ұзақ мерзімді үрдістерін, ластанудың маусымдық өзгерістерін және қауіпті кезеңдерді анықтау үшін өткен деректерді жүктеп алыңыз және талдаңыз.',
        },
        forecast: {
          title: 'Болжамды модельдеу',
          description: 'Жасанды интеллектке негізделген модельдер арқылы ертеңгі және келесі аптадағы ауа сапасының болжамын алыңыз. Бұл денсаулыққа қатысты шешім қабылдауға көмектеседі.',
        },
        visualization: {
          title: 'Интерактивті визуализация',
          description: 'Деректерді қарапайым кестелерде, гистограммаларда және карталық жылулық карталарында көру арқылы күрделі ақпаратты оңай қабылдаңыз.',
        },
        alerts: {
          title: 'Ескерту және хабарлама',
          description: 'Ауа сапасы қауіпті деңгейге жеткенде немесе болжанғанда, ескертулерді алу мүмкіндігі. Бұл сіздің және отбасыңыздың қауіпсіздігін қамтамасыз етеді.',
        },
        api: {
          title: 'API интеграциясы (Әзірлеушілер үшін)',
          description: 'ICPAIR деректерін өзіңіздің қосымшаларыңызға, зерттеулеріңізге немесе басқа жобаларыңызға қосу үшін біздің ашық API-ді пайдаланыңыз.',
        },
      },
      sensor: {
        title: 'Ауа Сапасын Бақылау Сенсорларын Сатып Алу',
        subtitle: 'Сіз өзіңіздің үйіңізде немесе кеңсеңізде ауа сапасын нақты уақытта бақылай аласыз. Біздің сенсорлар ICPAIR платформасына тікелей қосылады.',
        buy: 'Сатып алу',
        products: {
          basic: {
            title: 'Базалық үй сенсоры',
            features: ['PM2.5 өлшеу', 'Ішкі температура', 'Wi-Fi қосылымы', 'Мобильді қосымшаға қолдау'],
            price: '15 000 KZT',
          },
          standard: {
            title: 'Стандартты сыртқы сенсор',
            features: ['PM2.5 және PM10 өлшеу', 'Сыртқы пайдалануға арналған корпус (IP65)', 'АҚИ есебін жіберу', 'Бұлттық сақтау'],
            price: '45 000 KZT',
          },
          pro: {
            title: 'Кәсіби станция',
            features: ['PM2.5, PM10, SO2, NO2 өлшеу', 'Метеорологиялық датчиктер (Температура, Ылғалдылық)', 'GPS геолокация', 'ICPAIR деректер желісіне қосу'],
            price: '150 000 KZT',
          },
          business: {
            title: 'Бизнес пакеті (3 станция)',
            features: ['3 Кәсіби станция', 'Корпоративтік API қол жетімділігі', 'Жеке талдау есептері', '24/7 Техникалық қолдау'],
            price: '400 000 KZT',
          },
        },
      },
      cta: {
        title: 'Өз деректеріңізді пайдалануға дайынсыз ба?',
        body: 'Біздің API-ді пайдалану немесе ауа сапасын бақылау бағдарламалары бойынша ынтымақтастық туралы толығырақ білу үшін бізге хабарласыңыз.',
        button: 'Бізбен байланысу',
        alert: "Байланыс формасы осы жерде ашылады немесе 'About' бетіне бағытталады",
      },
    },
    common: {
      aqi: 'АҚИ',
      overallAqi: 'Жалпы АҚИ',
      time: 'Уақыт',
      location: 'Орналасу',
      category: 'Санат',
      confidence: 'Сенімділік',
      updated: 'Жаңартылды',
      loading: 'Жүктелуде...',
      notAvailable: 'Қолжетімсіз',
      none: '—',
      lastUpdated: 'Соңғы жаңарту',
      never: 'Ешқашан',
    },
    pollutants: {
      pm1: 'PM1',
      pm25: 'PM2.5',
      pm10: 'PM10',
      no2: 'NO₂',
      co: 'CO',
      o3: 'O₃',
      so2: 'SO₂',
      co2: 'CO₂',
      voc: 'VOC',
      temp: 'Темп',
      humidity: 'Ылғалд',
      ch2o: 'CH2O',
    },
    aqiCategories: {
      good: 'Жақсы',
      moderate: 'Орташа',
      sensitive: 'Сезімтал топтарға зиянды',
      unhealthy: 'Зиянды',
      veryUnhealthy: 'Өте зиянды',
      hazardous: 'Қауіпті',
      unknown: 'Белгісіз',
    },
    dashboard: {
      title: 'Ауа Сапасы Интеллекті',
      subtitle: 'Нақты уақыттағы мониторинг және болжау платформасы',
      refresh: 'Жаңарту',
      healthRecTitle: 'Денсаулыққа ұсыныс',
      dominant: 'Басым ластаушы',
      pollutantLevels: 'Ластаушы деңгейлері (µg/m³)',
      limitedPollutants: 'Бұл дереккөз шектеулі ластаушы мәліметтерін ғана ұсынады. Қосымша ластаушылар қолжетімсіз болуы мүмкін.',
      nextHours: 'Келесі 6 сағат',
      loadingForecast: 'Болжам жүктелуде...',
      criticalAlerts: 'Сын тұрғысынан ескертулер',
      activeAlerts: 'Белсенді ескертулер',
      footerNote: 'Көп сенсорға арналған нақты уақыттағы ауа сапасын бақылау',
    },
    healthRecommendations: {
      good: '✓ Ауа сапасы жақсы - далада белсенділік ұсынылады',
      moderate: '◐ Ауа сапасы қолайлы - көпшілік үшін далада болу қауіпсіз',
      sensitive: '△ Сезімтал топтар белсенділікті шектеуі керек',
      unhealthy: '⚠ Зиянды - даладағы белсенділікті шектеңіз',
      veryUnhealthy: '⚠⚠ Өте зиянды - далаға шықпаңыз',
      hazardous: '⚠⚠⚠ Қауіпті - үйде болыңыз',
    },
    history: {
      title: 'Тарихи үрдістер және талдау',
      subtitlePrefix: 'Таңдалған орындар бойынша өткен кезеңдегі деректерді қарау:',
      range: {
        h6: '6 сағат',
        h12: '12 сағат',
        h24: '24 сағат',
        d3: '3 күн',
        d7: '7 күн',
      },
      timePeriod: 'Уақыт аралығы:',
      selectLocation: 'Орынды таңдаңыз:',
      loadingChart: 'График жүктелуде...',
      noData: 'Дерек жоқ',
      min: 'Ең төмен',
      max: 'Ең жоғары',
      avg: 'Орташа',
      stdDev: 'Ск. ауытқу',
      displayPollutants: 'Көрсетілетін ластаушылар:',
      locationFallback: 'Орын',
    },
    akiReview: {
      title: 'AKI шолуы (Max 150)',
      subtitle: 'Орындар арасындағы ауа сапасы индексін салыстыру',
      table: {
        location: 'Орын',
        aqi: 'АҚИ',
        pm25: 'PM2.5',
        status: 'Күйі',
      },
    },
    weeklyTrends: {
      title: 'Соңғы аптадағы үрдістер (Орташа AKI)',
      averageLabel: 'Орташа',
      insightTitle: '💡 Түсінік:',
      insightBody: 'Ластанудың ең жоғары деңгейлері жұмыс аптасының басында байқалды, бұл көлік қозғалысының әсерін көрсетеді. Демалыс күндері ауа айтарлықтай таза болады.',
      days: {
        mon: 'Дс',
        tue: 'Сс',
        wed: 'Ср',
        thu: 'Бс',
        fri: 'Жм',
        sat: 'Сн',
        sun: 'Жс',
      },
    },
    keyTerms: {
      title: 'Негізгі терминдер түсіндірмесі',
      subtitle: 'Ауа сапасы көрсеткіштері мен ластаушыларды түсіну',
      terms: {
        aqi: 'Ауа сапасының индексі. Бұл ауаның қаншалықты таза немесе ластанғанын көрсететін сандық шкала. 0 (ең жақсы) – 500+ (ең нашар).',
        pm25: 'Диаметрі 2.5 микрометрден кіші ұсақ бөлшектер. Олар өкпеге терең еніп, денсаулыққа зиян келтіруі мүмкін.',
        pm10: 'Диаметрі 10 микрометрден кіші бөлшектер. Әдетте құрылыс және жол шаңынан пайда болады. Тыныс алуға әсер етеді.',
        no2: 'Азот диоксиді. Көлік пен электр станцияларынан шығатын газ. Тыныс алу жолдарына зиян.',
        o3: 'Озон. Жер бетінде зиянды ластаушы, әсіресе тыныс алу аурулары бар адамдарға қауіпті.',
        co: 'Көміртек тотығы. Иіссіз, түссіз газ. Жоғары концентрацияда қауіпті.',
      },
      interpretTitle: '📚 АҚИ мәндерін қалай түсіндіруге болады:',
      interpret: {
        good: 'Жақсы',
        moderate: 'Орташа',
        sensitive: 'Сезімтал',
        unhealthy: 'Зиянды',
        hazardous: 'Қауіпті',
      },
    },
    causes: {
      title: 'Ластанудың негізгі себептері',
      subtitle: 'Қалалық аймақтардағы ластану көздерін түсіну',
      contribution: 'Үлесі',
      cards: {
        vehicles: {
          title: 'Көлік шығарындылары',
          description: 'Қаладағы көліктерден шығатын азот оксидтері және ұсақ бөлшектер (PM) ластанудың басты көзі.',
        },
        heating: {
          title: 'Жеке жылыту',
          description: 'Қыста көмір мен арзан отынды пайдалану зиянды түтін мен күйені атмосфераға шығарады.',
        },
        industry: {
          title: 'Өнеркәсіп әсері',
          description: 'Жергілікті жылу электр станциялары мен зауыттардың шығарындылары және ауыр бөлшектер ауа сапасына әсер етеді.',
        },
        geo: {
          title: 'Географиялық фактор',
          description: 'Алматы таулармен қоршалған, қыста инверсия қабаты пайда болады. Ластаушылар қала үстінде жиналып, таралмайды.',
        },
      },
      peakTitle: '🔴 Ластану шыңы:',
      peakBody: 'Ластанудың ең жоғары деңгейлері жұмыс аптасының басында байқалады, бұл көлік қозғалысының әсерін көрсетеді.',
    },
    recommendations: {
      title: 'Ауа сапасын жақсарту үшін не істеуге болады?',
      subtitle: 'Таза ауа үшін жеке және ортақ әрекеттер',
      howTo: 'Қалай:',
      cards: {
        transport: {
          title: 'Қоғамдық көлік / Жаяу жүру',
          description: 'Қала ішінде жеке көлікті мүмкіндігінше аз пайдаланыңыз. Бұл шығарындыларды бірден азайтады.',
          tips: [
            'Қоғамдық көлік пен метроні пайдаланыңыз',
            'Әріптестермен бірге жүру',
            'Қысқа қашықтыққа велосипедпен немесе жаяу жүріңіз',
            'Көліксіз қала бастамаларын қолдаңыз',
          ],
        },
        energy: {
          title: 'Энергияны үнемдеу',
          description: 'Үйде энергияны үнемдеңіз. Жылуды тиімді пайдалану көмірмен жұмыс істейтін өндіріс жүктемесін азайтады.',
          tips: [
            'Үйді дұрыс оқшаулаңыз',
            'Энергия тиімді құрылғыларды қолданыңыз',
            'Жаңартылатын энергияға ауысыңыз',
            'Қыста қажетсіз жылытуға жол бермеңіз',
          ],
        },
        informed: {
          title: 'Хабардар болыңыз',
          description: 'Осы панель арқылы ауа сапасын үнемі тексеріп, таңертеңгі уақытта күн сәулесінен ұзақ болмаңыз.',
          tips: [
            'Сыртқа шықпас бұрын АҚИ-ды тексеріңіз',
            'Ластану жоғары кезде қорғаныс маскасын киіңіз',
            'Таза уақытта спортпен айналысыңыз',
            'Отбасыңызбен ақпарат бөлісіңіз',
          ],
        },
        policy: {
          title: 'Саясат өзгерістерін қолдау',
          description: 'Эмиссия стандарттары мен жасыл аймақтар сияқты ауа сапасын жақсарту бастамаларын қолдаңыз.',
          tips: [
            'Экологиялық саясаттарды қолдаңыз',
            'Қауымдастық тазалау шараларына қатысыңыз',
            'Ағаш отырғызу бастамаларын қолдаңыз',
            'Қатаң эмиссия ережелерін қолдаңыз',
          ],
        },
      },
      cta: {
        title: 'Біз бірге өзгеріс жасай аламыз',
        body: 'Ауа сапасын жақсарту — ортақ жауапкершілік. Әрбір әрекет дені сау орта қалыптастыруға үлес қосады. Бүгіннен бастап шағын қадам жасаңыз және басқаларды шабыттандырыңыз.',
        button: 'Ауа сапасы туралы толығырақ',
      },
    },
    locationSelector: {
      title: 'Орындарды бақылау',
      addLocation: 'Орын қосу',
      remove: 'Өшіру',
      monitoring: 'Бақылауда',
      locationSingular: 'орын',
      locationPlural: 'орын',
      outOf: 'ішінен',
      searchPlaceholder: 'Орындарды немесе қалаларды іздеу...',
      done: 'Дайын',
    },
    forecast: {
      unavailable: 'Болжам қолжетімсіз',
      noDataTitle: '7 күндік ауа сапасы болжамы',
      noDataBody: 'Бұл сенсор үшін болжам деректері жоқ.',
      title: '3 күндік ауа сапасы болжамы',
      nextDays: 'Келесі 3 күн',
      updatedLabel: 'Жаңартылды',
    },
    footer: {
      about: {
        body: 'ICPAIR — ауа сапасын нақты уақыт режимінде бақыла. Ластану деңгейі, болжамдар және қала тұрғындарына арналған аналитика.',
        copy: '© 2025 ICPAIR. Барлық құқықтар қорғалған. 🌍💙',
      },
      social: {
        title: 'Біз әлеуметтік желілердеміз:',
        instagram: 'Instagram',
        telegram: 'Telegram',
      },
      contacts: {
        title: 'Байланыс:',
      },
    },
    map: {
      quickHint: 'Жылдам тексеру үшін картаның кез келген жерін басыңыз.',
      loading: 'Сенсор деректері жүктелуде...',
      locationLabel: 'Орналасу',
      timeLabel: 'Уақыт',
      noReading: 'Пайдалануға қолжетімді оқу жоқ.',
    },
  },
  ru: {
    nav: {
      home: 'Главная',
      about: 'О нас',
      services: 'Услуги',
      language: 'Язык',
      languages: {
        en: 'English',
        kk: 'Қазақша',
        ru: 'Русский',
      },
    },
    home: {
      tabs: {
        dashboard: 'Панель',
        map: 'Карта',
        charts: 'Исторические графики',
      },
      loading: 'Загрузка...',
    },
    app: {
      loading: 'Загрузка...',
    },
    about: {
      mission: {
        title: 'Наша миссия',
        lead: 'ICPAIR — цифровой портал, предоставляющий данные об окружающей среде в реальном времени и за прошлые периоды для Алматы и жителей Казахстана.',
        body: 'Наша цель — повысить прозрачность и помочь людям принимать осознанные решения в вопросах качества воздуха. Мы используем технологии для продвижения экологической ответственности.',
        alt: 'Иллюстрация миссии',
      },
      parallax: {
        title: 'Вместе к чистому будущему!',
      },
      values: {
        title: 'Наши ключевые ценности',
        transparency: {
          title: 'Прозрачность данных',
          description: 'Мы всегда представляем информацию точно, понятно и доступно для всех.',
        },
        impact: {
          title: 'Экологический эффект',
          description: 'Наша главная задача — способствовать позитивным изменениям ради чистого воздуха.',
        },
        innovation: {
          title: 'Инновации',
          description: 'Мы используем новейшие технологии для визуализации и прогнозирования.',
        },
      },
      tech: {
        title: 'Технологическая платформа и источники данных',
        satellite: {
          title: 'Спутниковые данные',
          description: 'ICPAIR использует изображения спутника Copernicus Sentinel-5P для мониторинга концентраций загрязнителей (NO2, SO2).',
        },
        ground: {
          title: 'Наземные сенсоры',
          description: 'Мы объединяем официальные и частные сети датчиков для получения локальных данных в реальном времени о частицах PM2.5 и PM10 в Алматы.',
        },
        ai: {
          title: 'AI‑обработка данных',
          description: 'ICPAIR использует модели машинного обучения для надежных прогнозов и исторических трендов.',
        },
      },
      collab: {
        title: 'Работайте с нами',
        lead: 'ICPAIR всё ещё развивается. Мы приглашаем поддержать проект данными, технологиями или волонтёрством.',
        volunteer: {
          title: 'Станьте волонтёром',
          description: 'Помогите с установкой датчиков или организацией общественных мероприятий.',
        },
        developers: {
          title: 'Разработчики',
          description: 'Внесите вклад в наш открытый API и создавайте новые визуализации.',
        },
        partner: {
          title: 'Станьте партнёром',
          description: 'Поддержите проект через экологические программы вашей организации.',
        },
      },
    },
    services: {
      hero: {
        titlePrefix: 'Основные',
        titleHighlight: 'услуги ICPAIR',
        subtitle: 'Мы используем передовые технологии, чтобы собирать, обрабатывать и предоставлять важную информацию о качестве воздуха.',
      },
      list: {
        realtime: {
          title: 'Мониторинг в реальном времени',
          description: 'Получайте непрерывные данные PM2.5, PM10 и AQI по ключевым зонам Алматы, визуализированные на карте.',
        },
        history: {
          title: 'Анализ исторических данных',
          description: 'Скачивайте и анализируйте прошлые данные, чтобы выявлять долгосрочные тренды, сезонные изменения и опасные периоды.',
        },
        forecast: {
          title: 'Прогнозное моделирование',
          description: 'Получайте прогнозы качества воздуха на завтра и следующую неделю на основе AI‑моделей.',
        },
        visualization: {
          title: 'Интерактивная визуализация',
          description: 'Воспринимайте сложную информацию через таблицы, графики и тепловые карты.',
        },
        alerts: {
          title: 'Оповещения и уведомления',
          description: 'Получайте предупреждения, когда качество воздуха достигает или прогнозируется на опасном уровне.',
        },
        api: {
          title: 'Интеграция API (для разработчиков)',
          description: 'Используйте наш открытый API для интеграции данных ICPAIR в ваши приложения, исследования или проекты.',
        },
      },
      sensor: {
        title: 'Покупка датчиков качества воздуха',
        subtitle: 'Следите за качеством воздуха дома или в офисе в реальном времени. Наши сенсоры подключаются напрямую к платформе ICPAIR.',
        buy: 'Купить',
        products: {
          basic: {
            title: 'Базовый домашний сенсор',
            features: ['Измерение PM2.5', 'Температура внутри', 'Wi‑Fi подключение', 'Поддержка мобильного приложения'],
            price: '15 000 KZT',
          },
          standard: {
            title: 'Стандартный уличный сенсор',
            features: ['Измерение PM2.5 и PM10', 'Корпус для улицы (IP65)', 'Отправка AQI', 'Облачное хранение'],
            price: '45 000 KZT',
          },
          pro: {
            title: 'Профессиональная станция',
            features: ['PM2.5, PM10, SO2, NO2', 'Метеодатчики (Температура, Влажность)', 'GPS‑геолокация', 'Подключение к сети ICPAIR'],
            price: '150 000 KZT',
          },
          business: {
            title: 'Бизнес‑пакет (3 станции)',
            features: ['3 профессиональные станции', 'Доступ к корпоративному API', 'Индивидуальные отчёты', 'Техподдержка 24/7'],
            price: '400 000 KZT',
          },
        },
      },
      cta: {
        title: 'Готовы использовать свои данные?',
        body: 'Свяжитесь с нами, чтобы узнать больше об использовании API или о сотрудничестве по программам мониторинга воздуха.',
        button: 'Связаться с нами',
        alert: "Здесь откроется форма связи или будет переход на страницу 'О нас'.",
      },
    },
    common: {
      aqi: 'AQI',
      overallAqi: 'Общий AQI',
      time: 'Время',
      location: 'Местоположение',
      category: 'Категория',
      confidence: 'Достоверность',
      updated: 'Обновлено',
      loading: 'Загрузка...',
      notAvailable: 'Нет данных',
      none: '—',
      lastUpdated: 'Последнее обновление',
      never: 'Никогда',
    },
    pollutants: {
      pm1: 'PM1',
      pm25: 'PM2.5',
      pm10: 'PM10',
      no2: 'NO₂',
      co: 'CO',
      o3: 'O₃',
      so2: 'SO₂',
      co2: 'CO₂',
      voc: 'VOC',
      temp: 'Темп',
      humidity: 'Влажн',
      ch2o: 'CH2O',
    },
    aqiCategories: {
      good: 'Хорошо',
      moderate: 'Умеренно',
      sensitive: 'Вредно для чувствительных групп',
      unhealthy: 'Вредно',
      veryUnhealthy: 'Очень вредно',
      hazardous: 'Опасно',
      unknown: 'Неизвестно',
    },
    dashboard: {
      title: 'Интеллект качества воздуха',
      subtitle: 'Платформа мониторинга и прогнозирования в реальном времени',
      refresh: 'Обновить',
      healthRecTitle: 'Рекомендация по здоровью',
      dominant: 'Доминирующий',
      pollutantLevels: 'Уровни загрязнителей (µg/m³)',
      limitedPollutants: 'Этот источник данных предоставляет ограниченные сведения о загрязнителях. Дополнительные показатели могут быть недоступны.',
      nextHours: 'Следующие 6 часов',
      loadingForecast: 'Загрузка прогноза...',
      criticalAlerts: 'Критические оповещения',
      activeAlerts: 'Активные оповещения',
      footerNote: 'Мониторинг качества воздуха в реальном времени для нескольких сенсоров',
    },
    healthRecommendations: {
      good: '✓ Хорошее качество воздуха — рекомендуются прогулки',
      moderate: '◐ Допустимое качество воздуха — большинство может быть на улице',
      sensitive: '△ Чувствительным группам следует ограничить активность',
      unhealthy: '⚠ Вредно — ограничьте активность на улице',
      veryUnhealthy: '⚠⚠ Очень вредно — избегайте пребывания на улице',
      hazardous: '⚠⚠⚠ Опасно — оставайтесь дома',
    },
    history: {
      title: 'Исторические тренды и анализ',
      subtitlePrefix: 'Просмотр подробных исторических данных за',
      range: {
        h6: '6 часов',
        h12: '12 часов',
        h24: '24 часа',
        d3: '3 дня',
        d7: '7 дней',
      },
      timePeriod: 'Период времени:',
      selectLocation: 'Выберите место:',
      loadingChart: 'Загрузка графика...',
      noData: 'Нет данных',
      min: 'Минимум',
      max: 'Максимум',
      avg: 'Среднее',
      stdDev: 'Стд откл.',
      displayPollutants: 'Показывать загрязнители:',
      locationFallback: 'Место',
    },
    akiReview: {
      title: 'Обзор AKI (Макс 150)',
      subtitle: 'Сравнение индекса качества воздуха по локациям',
      table: {
        location: 'Место',
        aqi: 'AQI',
        pm25: 'PM2.5',
        status: 'Статус',
      },
    },
    weeklyTrends: {
      title: 'Тренды за последнюю неделю (Средний AKI)',
      averageLabel: 'Среднее',
      insightTitle: '💡 Инсайт:',
      insightBody: 'Самые высокие уровни загрязнения наблюдались в начале рабочей недели из-за влияния трафика. В выходные воздух заметно чище.',
      days: {
        mon: 'Пн',
        tue: 'Вт',
        wed: 'Ср',
        thu: 'Чт',
        fri: 'Пт',
        sat: 'Сб',
        sun: 'Вс',
      },
    },
    keyTerms: {
      title: 'Пояснение ключевых терминов',
      subtitle: 'Понимание показателей качества воздуха и загрязнителей',
      terms: {
        aqi: 'Индекс качества воздуха. Числовая шкала, показывающая, насколько воздух чистый или загрязнённый. От 0 (лучше) до 500+ (хуже).',
        pm25: 'Мелкие частицы диаметром менее 2.5 мкм. Проникают глубоко в лёгкие и несут серьёзные риски для здоровья.',
        pm10: 'Частицы менее 10 мкм. Часто возникают из-за строительной и дорожной пыли. Могут влиять на дыхание и видимость.',
        no2: 'Диоксид азота. Красно-бурый газ, образующийся в основном от транспорта и электростанций. Вызывает проблемы с дыханием.',
        o3: 'Озон. Вредный загрязнитель у поверхности земли, особенно опасен для людей с респираторными заболеваниями.',
        co: 'Монооксид углерода. Бесцветный, без запаха газ, образующийся при сгорании топлива. Опасен в высоких концентрациях.',
      },
      interpretTitle: '📚 Как интерпретировать значения AQI:',
      interpret: {
        good: 'Хорошо',
        moderate: 'Умеренно',
        sensitive: 'Чувствительные',
        unhealthy: 'Вредно',
        hazardous: 'Опасно',
      },
    },
    causes: {
      title: 'Основные причины загрязнённого воздуха',
      subtitle: 'Понимание ключевых источников загрязнения в городах',
      contribution: 'Вклад',
      cards: {
        vehicles: {
          title: 'Выбросы транспорта',
          description: 'Оксиды азота и мелкие частицы (PM) от транспорта — главные источники загрязнения.',
        },
        heating: {
          title: 'Индивидуальное отопление',
          description: 'Использование угля и дешёвого топлива зимой выделяет вредный дым и сажу.',
        },
        industry: {
          title: 'Промышленное воздействие',
          description: 'Выбросы от ТЭЦ и заводов, а также тяжёлые частицы (диоксид серы) ухудшают качество воздуха.',
        },
        geo: {
          title: 'Географический фактор',
          description: 'Алматы окружён горами, зимой образуется инверсия. Загрязнители накапливаются и не рассеиваются.',
        },
      },
      peakTitle: '🔴 Пик загрязнения:',
      peakBody: 'Самые высокие уровни загрязнения наблюдались в начале рабочей недели из-за влияния трафика.',
    },
    recommendations: {
      title: 'Что можно сделать для улучшения качества воздуха?',
      subtitle: 'Личные и коллективные действия ради более чистого воздуха',
      howTo: 'Как сделать:',
      cards: {
        transport: {
          title: 'Общественный транспорт / Ходьба',
          description: 'Старайтесь меньше пользоваться личным транспортом в городе. Это сразу снизит выбросы.',
          tips: [
            'Пользуйтесь автобусами и метро',
            'Ездите вместе с коллегами',
            'Ходите пешком или ездите на велосипеде',
            'Поддерживайте инициативы без машин',
          ],
        },
        energy: {
          title: 'Энергосбережение',
          description: 'Экономьте энергию дома. Эффективное использование тепла снижает потребность в угольной генерации.',
          tips: [
            'Правильно утепляйте дом',
            'Используйте энергоэффективные приборы',
            'Переходите на возобновляемую энергию',
            'Снижайте избыточный обогрев зимой',
          ],
        },
        informed: {
          title: 'Будьте в курсе',
          description: 'Регулярно проверяйте качество воздуха и ограничивайте пребывание на солнце утром.',
          tips: [
            'Проверяйте AQI перед выходом',
            'Носите маски при высоком загрязнении',
            'Планируйте активность при низком загрязнении',
            'Делитесь информацией с семьёй',
          ],
        },
        policy: {
          title: 'Поддержка изменений политики',
          description: 'Поддерживайте инициативы по улучшению качества воздуха: стандарты выбросов и зелёные зоны.',
          tips: [
            'Поддерживайте экологические программы',
            'Участвуйте в уборках сообщества',
            'Поддерживайте озеленение',
            'Требуйте более строгих норм выбросов',
          ],
        },
      },
      cta: {
        title: 'Вместе мы можем изменить ситуацию',
        body: 'Улучшение качества воздуха — коллективная ответственность. Каждый шаг помогает создать более здоровую среду. Начните с малого сегодня и вдохновляйте других.',
        button: 'Узнать больше о качестве воздуха',
      },
    },
    locationSelector: {
      title: 'Контроль локаций',
      addLocation: 'Добавить',
      remove: 'Удалить',
      monitoring: 'Отслеживается',
      locationSingular: 'локация',
      locationPlural: 'локаций',
      outOf: 'из',
      searchPlaceholder: 'Поиск локаций или городов...',
      done: 'Готово',
    },
    forecast: {
      unavailable: 'Прогноз недоступен',
      noDataTitle: 'Прогноз качества воздуха на 7 дней',
      noDataBody: 'Нет данных прогноза для этого сенсора.',
      title: 'Прогноз качества воздуха на 3 дня',
      nextDays: 'Следующие 3 дня',
      updatedLabel: 'Обновлено',
    },
    footer: {
      about: {
        body: 'ICPAIR — мониторинг качества воздуха в реальном времени. Уровень загрязнения, прогнозы и аналитика для жителей города.',
        copy: '© 2025 ICPAIR. Все права защищены. 🌍💙',
      },
      social: {
        title: 'Мы в социальных сетях:',
        instagram: 'Instagram',
        telegram: 'Telegram',
      },
      contacts: {
        title: 'Контакты:',
      },
    },
    map: {
      quickHint: 'Нажмите в любом месте карты для быстрого просмотра.',
      loading: 'Загрузка данных сенсоров...',
      locationLabel: 'Местоположение',
      timeLabel: 'Время',
      noReading: 'Нет доступных данных.',
    },
  },
};

const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES = ['en', 'kk', 'ru'];

const getFromPath = (locale, key) => {
  return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), dictionary[locale]);
};

export const t = (key, locale = DEFAULT_LOCALE) => {
  const localeValue = getFromPath(locale, key);
  if (localeValue !== undefined) return localeValue;
  const fallbackValue = getFromPath(DEFAULT_LOCALE, key);
  return fallbackValue !== undefined ? fallbackValue : key;
};

const LanguageContext = createContext({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key) => t(key, DEFAULT_LOCALE),
});

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_LOCALE;
    const saved = window.localStorage.getItem('locale');
    return SUPPORTED_LOCALES.includes(saved) ? saved : DEFAULT_LOCALE;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('locale', locale);
    }
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key) => t(key, locale),
    }),
    [locale]
  );

  return React.createElement(LanguageContext.Provider, { value }, children);
};

export const useLanguage = () => useContext(LanguageContext);
