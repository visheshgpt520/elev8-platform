import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { EconomyService } from '../services/api';

const Navbar = ({ onMenuOpen }) => {
    const navigate = useNavigate();
    const { currentUser } = useStore();
    const [balance, setBalance] = useState(0);
    const [isDark, setIsDark] = useState(true);
    const [isSpinning, setIsSpinning] = useState(false);

    useEffect(() => {
        // Sync state with actual DOM class
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const data = await EconomyService.getBalance(currentUser.walletId);
                setBalance(data.available_balance);
            } catch (error) {
                console.error("Could not fetch balance", error);
            }
        };
        fetchBalance();

        // Simple polling to keep navbar fresh if we aren't hooking native sockets deeply yet
        const interval = setInterval(fetchBalance, 10000);
        return () => clearInterval(interval);
    }, [currentUser.walletId]);

    const toggleTheme = (event) => {
        const currentlyDark = document.documentElement.classList.contains('dark');

        // Spin the icon
        setIsSpinning(true);
        setTimeout(() => setIsSpinning(false), 600);

        const toggle = () => {
            document.documentElement.classList.toggle('dark');
            const nowDark = document.documentElement.classList.contains('dark');
            setIsDark(nowDark);
            localStorage.setItem('elev8-theme-mode', nowDark ? 'dark' : 'light');
        };

        if (!document.startViewTransition) {
            toggle(); // Fallback for unsupported browsers
            return;
        }

        const x = event.clientX;
        const y = event.clientY;
        const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
        const transition = document.startViewTransition(toggle);
        transition.ready.then(() => {
            const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
            document.documentElement.animate(
                { clipPath: currentlyDark ? [...clipPath].reverse() : clipPath },
                { duration: 600, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: currentlyDark ? '::view-transition-old(root)' : '::view-transition-new(root)' }
            );
        });
    };

    return (
        <nav className="relative z-50 w-full h-16 bg-white dark:bg-bg-nav flex items-center px-4 lg:px-6 border-b border-slate-200 dark:border-white/5 shrink-0">

            {/* Logo Section (Aligns rigidly with Sidebar width below it) */}
            <div className="flex items-center gap-4 w-56 shrink-0 mr-4">
                <button onClick={onMenuOpen} className="md:hidden text-slate-400 dark:text-text-muted hover:text-slate-900 dark:hover:text-white transition-colors p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate('/lobby')}
                >
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded bg-accent-brand flex items-center justify-center text-black font-extrabold text-lg md:text-xl shadow-[0_0_15px_var(--brand-glow)]">
                        8
                    </div>
                    <span className="text-xl md:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-widest uppercase">
                        ELEV<span className="text-accent-brand">8</span>
                    </span>
                </div>
            </div>

            {/* Left-Aligned Global Search (Shuffle Style) */}
            <div className="hidden md:flex flex-1 max-w-sm relative group mr-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-text-muted group-focus-within:text-[#8b5cf6] transition-colors"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <input
                    type="text"
                    className="w-full bg-slate-100 dark:bg-[#0B0E14] shadow-sm dark:shadow-inner border border-slate-200 dark:border-white/5 rounded-full py-2.5 pl-11 pr-4 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-text-muted focus:outline-none focus:border-[#8b5cf6]/50 transition-all"
                    placeholder="Search"
                />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 ml-auto">
                <div className="hidden sm:flex items-center bg-slate-100 dark:bg-[#0B0E14] rounded-full h-10 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-inner pr-1 pl-4">
                    <div className="flex items-center mr-3">
                        <span className="text-slate-900 dark:text-white font-bold font-display tracking-wide text-sm">{balance.toLocaleString()}</span>
                        <span className="text-[#8b5cf6] ml-1.5 font-bold text-xs">CR</span>
                    </div>
                    <button className="h-8 w-8 bg-[#8b5cf6] hover:bg-[#a78bfa] active:scale-95 transition-all rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.6)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                </div>

                {/* Theme Toggle (Sun/Moon) */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-lg bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-[#2d3748] text-amber-500 dark:text-yellow-300 transition-all active:scale-90"
                    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    <span className={`inline-block transition-transform duration-500 ${isSpinning ? 'rotate-[360deg] scale-110' : ''}`}>
                        {isDark ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                        )}
                    </span>
                </button>

                {/* Admin Access / Treasury */}
                <button
                    onClick={() => navigate('/admin-login')}
                    className="p-2.5 rounded hover:bg-slate-100 dark:hover:bg-bg-app text-slate-400 dark:text-text-muted hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </button>

                {/* User Avatar Placeholder */}
                <div className="w-10 h-10 rounded-md bg-slate-100 dark:bg-bg-card hover:bg-slate-200 dark:hover:bg-bg-app cursor-pointer flex items-center justify-center transition-colors shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-white"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
