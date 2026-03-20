import React from 'react';
import { useNavigate } from 'react-router-dom';

const navCategories = [
    {
        title: 'Casino',
        items: [
            { id: 1, name: 'Motion Games', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg> },
            { id: 2, name: 'Casino Classics', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> },
            { id: 3, name: 'Live Tables', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg> }
        ]
    },
    {
        title: 'Community',
        items: [
            { id: 4, name: 'Leaderboard', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> },
            { id: 5, name: 'Promotions', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg> },
            { id: 6, name: 'VIP Club', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h.01"></path><path d="M7 20v-4"></path><path d="M12 20v-8"></path><path d="M17 20V8"></path><path d="M22 4v16"></path></svg> }
        ]
    },
    {
        title: 'Support',
        items: [
            { id: 7, name: 'Help Center', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> },
            { id: 8, name: 'Responsible Gaming', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> }
        ]
    }
];

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <aside className="hidden md:flex flex-col w-64 bg-[#0f212e] h-screen sticky top-0 overflow-y-auto border-r border-white/5 scrollbar-hide">
            <div className="p-6">
                <div
                    className="flex items-center gap-2 cursor-pointer mb-8"
                    onClick={() => navigate('/lobby')}
                >
                    <div className="w-8 h-8 rounded bg-[#1fff20] flex items-center justify-center text-black font-extrabold text-xl shadow-[0_0_15px_rgba(31,255,32,0.4)]">
                        8
                    </div>
                    <span className="text-2xl font-display font-bold text-white tracking-widest uppercase">
                        ELEV<span className="text-[#1fff20]">8</span>
                    </span>
                </div>

                <div className="space-y-8">
                    {navCategories.map((category, idx) => (
                        <div key={idx}>
                            {category.title && (
                                <h4 className="text-[#8798a4] text-xs font-bold uppercase tracking-wider mb-3 px-2">
                                    {category.title}
                                </h4>
                            )}
                            <ul className="space-y-1">
                                {category.items.map(item => (
                                    <li key={item.id}>
                                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[#b1c0cd] hover:bg-[#1a2c38] hover:text-white transition-colors text-sm font-semibold group">
                                            <span className="text-[#8798a4] group-hover:text-white transition-colors">
                                                {item.icon}
                                            </span>
                                            {item.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-auto p-6 border-t border-white/5 space-y-3">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[#b1c0cd] hover:bg-[#1a2c38] hover:text-white transition-colors text-sm font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    English
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
