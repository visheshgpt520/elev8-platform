import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PokerGame = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Prevent scrolling on the document body while the game is active
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="flex flex-col h-screen w-full bg-[#090e13] relative">
            {/* Minimal Header Bar to match dashboard */}
            <div className="h-14 bg-[#111620] border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-10 w-full">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/lobby')}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <h1 className="text-white font-display font-bold text-lg tracking-wide uppercase">Texas Hold'em <span className="text-[#8b5cf6] font-black italic">PRO</span></h1>
                </div>
            </div>

            {/* Unity WebGL Container */}
            <div className="flex-1 w-full bg-black relative">
                {/* Fallback loading message behind the iframe */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-50 z-0">
                    <div className="w-12 h-12 border-4 border-slate-800 border-t-[#8b5cf6] rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm text-center">
                        Waiting for Unity WebGL Build...<br/>
                        <span className="text-xs normal-case text-slate-600 mt-2 block">Make sure you placed the files in public/poker-game/</span>
                    </p>
                </div>
                
                <iframe 
                    src="/Poker-game/index.html"
                    className="w-full h-full border-none relative z-10"
                    title="Elev8 Poker"
                    allow="autoplay; fullscreen"
                />
            </div>
        </div>
    );
};

export default PokerGame;
