// Құндылықтарға арналған шағын компонент
const ValuePillar = ({ icon, title, description }) => (
    <div className="text-center p-6 bg-gray-50 rounded-xl shadow-md">
        <div className="text-4xl text-blue-600 mb-3">{icon}</div>
        <h4 className="text-xl font-bold text-gray-800 mb-2">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);

// ЖАҢА: Технология картасы компоненті
const TechnologyCard = ({ icon, title, description }) => (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-200">
        <div className="text-4xl text-green-600 mb-3">{icon}</div>
        <h4 className="text-xl font-bold text-gray-800 mb-2">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
    </div>
);

// ЖАҢА: Ынтымақтастық картасы компоненті
const CollaborationCard = ({ icon, title, description }) => (
    <div className="text-center p-6 bg-blue-50 border-t-4 border-blue-400 rounded-xl shadow-lg">
        <div className="text-4xl text-blue-600 mb-3">{icon}</div>
        <h4 className="text-xl font-bold text-gray-800 mb-2">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
    </div>
);

// Параллакс бөлігіне арналған стиль
const parallaxStyle = {
    // Нақты Алматы суретінің URL-і
    backgroundImage: "url('https://www.freetour.com/images/cities/almaty-kazakhstan.jpg')",
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
};

const AboutPage = () => {
    return (
        <div className="antialiased min-h-screen">
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

                {/* 1. Миссия бөлімі */}
                <section className="bg-white p-6 md:p-10 rounded-xl shadow-2xl mb-10">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 border-b pb-3">
                        Біздің Миссиямыз
                    </h2>
                    <div className="lg:flex lg:space-x-10 items-center">
                        <div className="lg:w-2/3 space-y-4">
                            <p className="text-xl font-medium text-gray-700">
                                ICPAIR — бұл Алматы қаласы мен Қазақстан азаматтарын нақты уақыттағы және тарихи экологиялық деректермен қамтамасыз ететін цифрлық портал.
                            </p>
                            <p className="text-gray-600">
                                Біздің мақсатымыз — ашықтықты арттыру және ауа сапасына қатысты мәселелер бойынша саналы шешім қабылдауға көмектесу. Біз экологиялық жауапкершілікті ілгерілету үшін технологияны қолданамыз.
                            </p>
                        </div>
                        <div className="lg:w-1/3 mt-8 lg:mt-0">
                            <img
                                src="https://images.unsplash.com/photo-1548450847-8a9a5cc3968f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWxtYXR5fGVufDB8fDB8fHww"
                                alt="Миссия иллюстрациясы"
                                className="rounded-xl shadow-lg w-full"
                            />
                        </div>
                    </div>
                </section>

                {/* 2. Параллакс Визуалды Ажыратушы */}
                <section
                    style={parallaxStyle}
                    className="h-64 flex items-center justify-center relative my-10 rounded-xl overflow-hidden shadow-2xl"
                >
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <h3 className="relative z-10 text-5xl font-extrabold text-white text-center tracking-wide">
                        Бірге таза болашаққа!
                    </h3>
                </section>

                {/* 3. Құндылықтар бөлімі */}
                <section className="mb-10">
                    <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                        Негізгі Құндылықтарымыз
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ValuePillar
                            icon="🔍"
                            title="Деректердің ашықтығы"
                            description="Біз әрқашан ақпаратты дәл, түсінікті және барлығына қолжетімді етіп ұсынамыз."
                        />
                        <ValuePillar
                            icon="🌱"
                            title="Экологиялық әсер"
                            description="Біздің жұмысымыздың негізгі міндеті — таза ауа үшін оң өзгерістерге ықпал ету."
                        />
                        <ValuePillar
                            icon="💡"
                            title="Инновация"
                            description="Біз деректерді визуализациялау және болжау үшін ең жаңа технологияларды қолданамыз."
                        />
                    </div>
                </section>

                {/* 4. Технологиялық Тұғырнама */}
                <section className="bg-gray-50 p-6 md:p-10 rounded-xl shadow-2xl mb-10">
                    <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center border-b pb-3">
                        Технологиялық Тұғырнама және Дереккөздері
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <TechnologyCard
                            icon="🛰️"
                            title="Спутниктік Деректер"
                            description="Ластаушы заттардың (NO2, SO2) жалпы концентрациясын бақылау үшін ICPAIR Copernicus Sentinel-5P спутниктік суреттерін пайдаланады."
                        />
                        <TechnologyCard
                            icon="📡"
                            title="Жерүсті Сенсорлары"
                            description="Алматыдағы PM2.5 және PM10 сияқты ұсақ бөлшектердің жергілікті, нақты уақыттағы көрсеткіштерін алу үшін ресми және жеке сенсор желілерін біріктіру."
                        />
                        <TechnologyCard
                            icon="🤖"
                            title="AI Деректерді Өңдеу"
                            description="Нақты және сенімді болжамдар мен тарихи трендтерді (көрсеткіштерді) жасау үшін ICPAIR Machine Learning (Машиналық оқыту) модельдерін пайдаланады."
                        />
                    </div>
                </section>

                {/* 5. ЖАҢА: Ынтымақтастыққа Шақыру (Жаңа жобаға арналған) */}
                <section className="mb-10">
                    <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                        Бізбен бірге жұмыс істеңіз
                    </h3>
                    <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
                        ICPAIR әлі де даму үстінде. Біздің жобамызды деректермен, технологиямен немесе ерікті көмекпен қолдауға шақырамыз.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <CollaborationCard
                            icon="🙋"
                            title="Ерікті болыңыз"
                            description="Сенсорлар орнатуға немесе қауымдастық іс-шараларын өткізуге көмектесіңіз."
                        />
                        <CollaborationCard
                            icon="👨‍💻"
                            title="Әзірлеушілер"
                            description="Біздің ашық бастапқы кодқа (API) үлес қосыңыз және жаңа визуализацияларды жасаңыз."
                        />
                        <CollaborationCard
                            icon="🤝"
                            title="Серіктес болыңыз"
                            description="Ұйымыңыздың экологиялық бағдарламалары арқылы біздің жобамызды қолдаңыз."
                        />
                    </div>
                </section>

            </main>
        </div>
    );
};

export default AboutPage;