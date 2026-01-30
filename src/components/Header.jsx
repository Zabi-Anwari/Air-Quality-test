import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
    const [productOpen, setProductOpen] = useState(false);
    const [resourcesOpen, setResourcesOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">


                <Link to="/" className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-sm bg-lime-400" />
                    <span className="text-white font-semibold text-xl">Astra</span>
                </Link>


                <nav className="flex items-center gap-8 text-white">

                    <Link to="/about" className="hover:text-lime-300 transition">
                        About
                    </Link>


                    <div className="relative">
                        <button
                            onMouseEnter={() => setProductOpen(true)}
                            onMouseLeave={() => setProductOpen(false)}
                            className="hover:text-lime-300 transition"
                        >
                            Product ▾
                        </button>

                        {productOpen && (
                            <div
                                className="absolute left-0 top-full mt-2 bg-[#0f1115] border border-white/10 rounded-lg shadow-lg w-40 py-2 text-sm"
                                onMouseEnter={() => setProductOpen(true)}
                                onMouseLeave={() => setProductOpen(false)}
                            >
                                <Link
                                    to="/platform"
                                    className="block px-4 py-2 hover:bg-white/10"
                                >
                                    Platform
                                </Link>
                                <Link
                                    to="/pricing"
                                    className="block px-4 py-2 hover:bg-white/10"
                                >
                                    Pricing
                                </Link>
                            </div>
                        )}
                    </div>


                    <div className="relative">
                        <button
                            onMouseEnter={() => setResourcesOpen(true)}
                            onMouseLeave={() => setResourcesOpen(false)}
                            className="hover:text-lime-300 transition"
                        >
                            Resources ▾
                        </button>

                        {resourcesOpen && (
                            <div
                                className="absolute left-0 top-full mt-2 bg-[#0f1115] border border-white/10 rounded-lg shadow-lg w-40 py-2 text-sm"
                                onMouseEnter={() => setResourcesOpen(true)}
                                onMouseLeave={() => setResourcesOpen(false)}
                            >
                                <Link
                                    to="/blog"
                                    className="block px-4 py-2 hover:bg-white/10"
                                >
                                    Blog
                                </Link>
                                <Link
                                    to="/guides"
                                    className="block px-4 py-2 hover:bg-white/10"
                                >
                                    Guides
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>


                <div className="flex items-center gap-4">

                    <Link
                        to="/get-started"
                        className="border border-white/30 text-white px-5 py-2 rounded-full hover:bg-white/10 transition"
                    >
                        Get Started →
                    </Link>

                    <Link
                        to="/contact"
                        className="px-6 py-2 rounded-full bg-lime-400 text-black font-medium hover:bg-lime-300 transition"
                    >
                        Contact Sales
                    </Link>

                </div>
            </div>
        </header>
    );
}
