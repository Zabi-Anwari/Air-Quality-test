import { FaInstagram, FaTelegram } from "react-icons/fa";

export default function Footer() {
    return (
        <div
            className="w-full p-10"
            style={{
                background: "radial-gradient(circle at 50% 30%, #184E3D 0%, #08251D 40%, #010B08 100%)",
            }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="hidden md:flex justify-between items-start">

                    <div className="flex-1">
                        {about()}
                    </div>

                    <div className="w-px h-32 bg-white/20 mx-10" />

                    <div className="flex-1">
                        {social()}
                    </div>

                    <div className="w-px h-32 bg-white/20 mx-10" />

                    <div className="flex-1">
                        {contacts()}
                    </div>
                </div>

                <div className="md:hidden flex flex-col gap-10">
                    {about()}
                    {social()}
                    {contacts()}
                </div>
            </div>
        </div>
    );
}

function about() {
    return (
        <div>
            <div className="flex items-center gap-3">
                <span className="text-white text-4xl">☁️</span>
                <h2 className="text-white text-xl font-bold">ICPAIR</h2>
            </div>

            <p className="text-white/70 mt-5 text-sm">
                ICPAIR — ауа сапасын нақты уақыт режимінде бақыла. Ластану деңгейі,
                болжамдар және қала тұрғындарына арналған аналитика.
            </p>

            <p className="text-white/50 mt-5 text-xs">
                © 2025 ICPAIR. Барлық құқықтар қорғалған. 🌍💙
            </p>
        </div>
    );
}

function social() {
    return (
        <div>
            <h2 className="text-white text-lg font-bold">Біз әлеуметтік желілердеміз:</h2>

            <div className="flex items-center gap-3 mt-5 text-white/70">
                <span>Instagram</span>
                <FaInstagram size={18} />
            </div>

            <div className="flex items-center gap-3 mt-5 text-white/70">
                <span>Telegram</span>
                <FaTelegram size={18} />
            </div>
        </div>
    );
}

function contacts() {
    return (
        <div>
            <h2 className="text-white text-lg font-bold">Байланыс:</h2>

            <p className="text-white/70 mt-5">icpair2025@gmail.com</p>
            <p className="text-white/70 mt-2">+7 777 77 77 77</p>
        </div>
    );
}
