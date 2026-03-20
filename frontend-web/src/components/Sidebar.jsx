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

const SidebarContent = ({ onClose }) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col h-full w-64 bg-white dark:bg-bg-nav border-r border-slate-200 dark:border-white/5">
            {/* Mobile close button */}
            {onClose && (
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/5 md:hidden">
                    <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Menu</span>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-bg-secondary transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            )}

            <div className="p-6 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="space-y-8">
                    {navCategories.map((category, idx) => (
                        <div key={idx}>
                            {category.title && (
                                <h4 className="text-slate-400 dark:text-text-muted text-xs font-bold uppercase tracking-wider mb-3 px-2">
                                    {category.title}
                                </h4>
                            )}
                            <ul className="space-y-1">
                                {category.items.map(item => {
                                    const isActive = item.name === 'Motion Games';
                                    return (
                                        <li key={item.id}>
                                            <button
                                                onClick={onClose}
                                                className={`w-full relative flex items-center gap-3 px-3 py-2.5 rounded-r-md text-sm font-semibold group transition-all duration-300 border-l-[3px]
                                                ${isActive
                                                        ? 'bg-[#8b5cf6]/10 text-slate-900 dark:text-white border-[#8b5cf6] shadow-[-4px_0_15px_-5px_rgba(139,92,246,0.5)]'
                                                        : 'text-slate-500 dark:text-text-secondary border-transparent hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}
                                            `}>
                                                <span className={`${isActive ? 'text-[#8b5cf6] drop-shadow-[0_0_5px_rgba(139,92,246,0.6)]' : 'text-slate-400 dark:text-text-muted group-hover:text-slate-900 dark:group-hover:text-white transition-colors'}`}>
                                                    {item.icon}
                                                </span>
                                                {item.name}
                                                {item.name === 'VIP Club' && (
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center px-1.5 py-0.5 bg-[#8b5cf6] text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(139,92,246,0.8)] animate-pulse">
                                                        New
                                                    </span>
                                                )}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-border-primary space-y-3">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-slate-500 dark:text-text-secondary hover:bg-slate-100 dark:hover:bg-bg-primary hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    English
                </button>
            </div>
        </div>
    );
};

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Desktop sidebar — always visible on md+ */}
            <aside className="hidden md:flex flex-col w-64 h-full sticky top-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <SidebarContent />
            </aside>

            {/* Mobile drawer overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    {/* Drawer panel — slides in from left */}
                    <div className="relative flex flex-col h-full shadow-2xl animate-slideInLeft">
                        <SidebarContent onClose={onClose} />
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
