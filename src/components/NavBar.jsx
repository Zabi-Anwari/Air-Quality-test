const NavBar = ({ activePage, setActivePage }) => {
    const navItems = [
        { id: 'home', label: 'Басты бет' },
        { id: 'about', label: 'Біз туралы' },
        { id: 'services', label: 'Қызметтер' },
    ];

    return (
        <header className="bg-white shadow-lg sticky top-0 z-10">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">


                    <div className="flex-shrink-0">
                        <span className="text-2xl font-extrabold text-gray-900">ICPAIR</span>
                    </div>


                    <div className="flex space-x-4">
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
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default NavBar;