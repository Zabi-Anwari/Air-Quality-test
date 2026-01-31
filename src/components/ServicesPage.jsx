import { useLanguage } from '../i18n.js';

// Қызмет картасының қосалқы компоненті
const ServiceCard = ({ icon, title, description }) => (
    <div className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-blue-500 hover:shadow-2xl transition duration-300 transform hover:scale-[1.02]">
        <div className="text-5xl text-blue-600 mb-4">{icon}</div>
        <h4 className="text-2xl font-bold text-gray-800 mb-3">{title}</h4>
        <p className="text-gray-600">{description}</p>
    </div>
);

// ЖАҢА: Сенсорлық өнім картасы компоненті
const SensorProductCard = ({ title, features, price, color, buyLabel }) => (
    <div className={`p-6 rounded-xl shadow-xl border-2 ${color} bg-white flex flex-col h-full hover:shadow-2xl transition duration-300`}>
        <h4 className={`text-2xl font-bold ${color.replace('border-', 'text-')} mb-3 border-b pb-2`}>{title}</h4>
        <p className="text-3xl font-extrabold text-gray-900 mb-4">{price}</p>

        <ul className="space-y-2 text-sm text-gray-700 flex-grow">
            {features.map((feature, i) => (
                <li key={i} className="flex items-start">
                    <span className={`text-green-500 mr-2 text-lg`}>✅</span>
                    <span>{feature}</span>
                </li>
            ))}
        </ul>

        <button className={`mt-6 w-full py-2 rounded-full font-bold transition duration-300 ${color.includes('green') ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
            {buyLabel}
        </button>
    </div>
);

const ServicesPage = () => {
    const { t } = useLanguage();

    const servicesList = [
        {
            icon: "🛰️",
            title: t('services.list.realtime.title'),
            description: t('services.list.realtime.description')
        },
        {
            icon: "🔍",
            title: t('services.list.history.title'),
            description: t('services.list.history.description')
        },
        {
            icon: "🔮",
            title: t('services.list.forecast.title'),
            description: t('services.list.forecast.description')
        },
        {
            icon: "📈",
            title: t('services.list.visualization.title'),
            description: t('services.list.visualization.description')
        },
        {
            icon: "🚨",
            title: t('services.list.alerts.title'),
            description: t('services.list.alerts.description')
        },
        {
            icon: "🔗",
            title: t('services.list.api.title'),
            description: t('services.list.api.description')
        }
    ];

    const sensorProducts = [
        {
            title: t('services.sensor.products.basic.title'),
            features: t('services.sensor.products.basic.features'),
            price: t('services.sensor.products.basic.price'),
            color: "border-gray-400"
        },
        {
            title: t('services.sensor.products.standard.title'),
            features: t('services.sensor.products.standard.features'),
            price: t('services.sensor.products.standard.price'),
            color: "border-blue-500"
        },
        {
            title: t('services.sensor.products.pro.title'),
            features: t('services.sensor.products.pro.features'),
            price: t('services.sensor.products.pro.price'),
            color: "border-green-500"
        },
        {
            title: t('services.sensor.products.business.title'),
            features: t('services.sensor.products.business.features'),
            price: t('services.sensor.products.business.price'),
            color: "border-purple-500"
        }
    ];

    return (
        <div className="antialiased min-h-screen">
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

                {/* 1. Негізгі тақырып және кіріспе */}
                <section className="bg-white p-6 md:p-10 rounded-xl shadow-2xl mb-10 text-center">
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-3">
                        {t('services.hero.titlePrefix')} <span className="text-blue-600">{t('services.hero.titleHighlight')}</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {t('services.hero.subtitle')}
                    </p>
                </section>

                {/* 2. Қызметтер тізімі */}
                <section className="mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {servicesList.map((service, index) => (
                            <ServiceCard
                                key={index}
                                icon={service.icon}
                                title={service.title}
                                description={service.description}
                            />
                        ))}
                    </div>
                </section>

                {/* 3. ЖАҢА СЕКЦИЯ: Сенсорлық Жабдықтарды Сату */}
                <section className="bg-gray-100 p-8 md:p-12 rounded-xl shadow-inner mb-10">
                    <h3 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
                        {t('services.sensor.title')}
                    </h3>
                    <p className="text-center text-lg text-gray-600 mb-10 max-w-4xl mx-auto">
                        {t('services.sensor.subtitle')}
                    </p>

                    {/* Өнім карталары */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sensorProducts.map((product, index) => (
                            <SensorProductCard key={index} {...product} buyLabel={t('services.sensor.buy')} />
                        ))}
                    </div>
                </section>


                {/* 4. Қосымша Ақпарат / CTA */}
                <section className="bg-gray-800 text-white p-8 md:p-12 rounded-xl shadow-2xl text-center">
                    <h3 className="text-3xl font-bold mb-4">
                        {t('services.cta.title')}
                    </h3>
                    <p className="text-lg text-gray-300 mb-6">
                        {t('services.cta.body')}
                    </p>
                    <button
                        // Навигацияны "About" (Байланыс) бетіне ауыстыру
                        onClick={() => alert(t('services.cta.alert'))}
                        className="bg-lime-400 text-gray-900 font-bold text-lg py-3 px-8 rounded-full transition duration-300 hover:bg-lime-300 shadow-xl"
                    >
                        {t('services.cta.button')}
                    </button>
                </section>

            </main>
        </div>
    );
};

export default ServicesPage;