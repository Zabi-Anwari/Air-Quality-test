import { useLanguage } from '../i18n.js';

const NavBar = ({ activePage, setActivePage }) => {
    const { locale, setLocale, t } = useLanguage();
    const navItems = [
        { id: 'home', label: t('nav.home') },
        { id: 'about', label: t('nav.about') },
        { id: 'services', label: t('nav.services') },
    ];

    return (
        <header className="bg-white shadow-lg sticky top-0 z-10">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">


                    <div className="flex-shrink-0">
                        <span className="text-2xl font-extrabold text-gray-900">ICPAIR</span>
                    </div>


                    <div className="flex space-x-4 items-center">
                        {navItems.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={() => setActivePage(item.id)}
                                className={`
                                    nav-link text-gray-600 hover:text-gray-900 px-3 py-2 font-medium transition duration-150 ease-in-out rounded-lg
                                    ${activePage === item.id ? 'active text-blue-800 border-b-2 border-blue-800' : ''}
                                `}
                            >
                                {item.label}
                            </a>
                        ))}
                        <div className="ml-2 flex items-center gap-2">
                            <label className="text-sm text-gray-600" htmlFor="language-select">
                                {t('nav.language')}
                            </label>
                            <select
                                id="language-select"
                                value={locale}
                                onChange={(event) => setLocale(event.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="en">{t('nav.languages.en')}</option>
                                <option value="kk">{t('nav.languages.kk')}</option>
                                <option value="ru">{t('nav.languages.ru')}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default NavBar;