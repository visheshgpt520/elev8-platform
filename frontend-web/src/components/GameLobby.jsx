import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { socket } from '../services/socket';
import { EconomyService } from '../services/api';
import LiveBetsTable from './LiveBetsTable';

const GameGridCard = ({ title, category, players, entryFee, hot, onSelect, image }) => (
    <div
        onClick={onSelect}
        className="group relative flex flex-col cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(147,51,234,0.5)] active:scale-95 hover:z-10 rounded-xl"
    >
        {/* Borderless Web3 Thumbnail Box */}
        <div className="w-full aspect-[3/4] rounded-xl overflow-hidden relative bg-slate-200 dark:bg-[#090e13] transition-all duration-300 group-hover:ring-2 group-hover:ring-purple-500/50">
            {image && (
                <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
            )}

            {/* Top-Left Floating Badge */}
            {hot && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-[9px] font-black uppercase tracking-wider shadow-[0_0_10px_rgba(244,63,94,0.5)] z-20 animate-pulse">
                    Hot
                </div>
            )}
            {!hot && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-gradient-to-r from-[#06b6d4] to-blue-500 text-white rounded-full text-[9px] font-black uppercase tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.5)] z-20 animate-pulse">
                    Live
                </div>
            )}

            {/* Vibrant Gradient Overlay (Bottom 30%) for Text Readability */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/60 dark:from-[#0B0E14] dark:via-[#0B0E14]/80 to-transparent z-10 flex flex-col justify-end p-2 pb-2.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-[12px] font-bold truncate drop-shadow-md">{title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
                    <span className="text-slate-300 dark:text-[#94a3b8] text-[10px] font-semibold">{players}</span>
                </div>
            </div>

            {/* Play Button Overlay (Centered minimal - appears on hover) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-black/40 backdrop-blur-[1px]">
                <div className="w-12 h-12 rounded-full bg-[#8b5cf6] flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.8)] text-white transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="ml-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </div>
            </div>
        </div>
    </div>
);

const GameLobby = () => {
    const navigate = useNavigate();
    const { currentUser, gameState, setGameState } = useStore();
    const [balance, setBalance] = useState(0);

    // Platform-relevant game data
    const shuffleGames = [
        { id: 1, title: 'Fruit Ninja', category: 'Motion PvP', players: '4,204', entryFee: '50 CR', hot: true, image: '/games/fruit-ninja.png' },
        { id: 2, title: 'Whack-a-Mole', category: 'Motion Solo', players: '3,892', entryFee: '100 CR', hot: true, image: '/games/whack-a-mole.png' },
        { id: 3, title: 'Beat Dodge', category: 'Motion Rhythm', players: '1,503', entryFee: '25 CR', hot: false, image: '/games/beat-dodge.png' },
        { id: 4, title: 'Goalkeeper VR', category: 'Motion Sports', players: '891', entryFee: '200 CR', hot: false, image: '/games/goalkeeper-vr.png' },
        { id: 5, title: 'Shadow Boxing', category: 'Motion Combat', players: '2,401', entryFee: '150 CR', hot: true, image: '/games/shadow-boxing.png' },
        { id: 6, title: 'Dance Royale', category: 'Motion Party', players: '672', entryFee: '50 CR', hot: false, image: '/games/dance-royale.png' },
        { id: 7, title: 'Elev8 Roulette', category: 'Table Game', players: '9,440', entryFee: '10 CR', hot: true, image: '/games/elev8-roulette.png' },
        { id: 8, title: 'Blackjack Pro', category: 'Card Game', players: '6,201', entryFee: '25 CR', hot: true, image: '/games/blackjack-pro.png' },
    ];

    const slotsLive = [
        { id: 9, title: "Texas Hold'em", category: 'Poker', players: '4,100', entryFee: '50 CR', hot: false, image: '/games/texas-holdem.png' },
        { id: 10, title: 'Baccarat Royal', category: 'Card Game', players: '2,802', entryFee: '100 CR', hot: false, image: '/games/baccarat-royal.png' },
        { id: 11, title: 'Hi-Lo Cards', category: 'Quick Play', players: '5,320', entryFee: '5 CR', hot: true, image: '/games/hi-lo-cards.png' },
        { id: 12, title: 'Dice Duel', category: 'Dice', players: '1,990', entryFee: '10 CR', hot: false, image: '/games/dice-duel.png' },
        { id: 13, title: 'Minesweeper X', category: 'Puzzle', players: '1,120', entryFee: '5 CR', hot: false, image: '/games/fruit-ninja.png' },
        { id: 14, title: 'Plinko Pro', category: 'Arcade', players: '8,420', entryFee: '10 CR', hot: true, image: '/games/shadow-boxing.png' },
        { id: 15, title: 'Crash Royale', category: 'Crypto', players: '12,300', entryFee: '20 CR', hot: true, image: '/games/beat-dodge.png' },
        { id: 16, title: 'Wheel of Win', category: 'Wheel', players: '3,400', entryFee: '50 CR', hot: false, image: '/games/dance-royale.png' },
    ];

    // Platform stats (simulated — in production these come from API)
    const platformStats = {
        onlinePlayers: '12,847',
        totalWonToday: '₹4,82,500',
        gamesPlayedToday: '34,219',
        biggestWin: '₹52,000',
    };

    // Leaderboard (simulated)
    const topWinners = [
        { rank: 1, player: 'MotionKing', game: 'Fruit Ninja', amount: '₹12,500', timeAgo: '4m ago' },
        { rank: 2, player: 'AceHigh99', game: 'Blackjack Pro', amount: '₹8,200', timeAgo: '11m ago' },
        { rank: 3, player: 'NinjaSlayer', game: 'Whack-a-Mole', amount: '₹6,400', timeAgo: '18m ago' },
        { rank: 4, player: 'RouletteQueen', game: 'Elev8 Roulette', amount: '₹5,100', timeAgo: '22m ago' },
        { rank: 5, player: 'DiceDevil', game: 'Hi-Lo Cards', amount: '₹4,800', timeAgo: '31m ago' },
    ];

    useEffect(() => {
        EconomyService.getBalance(currentUser.walletId).then(d => setBalance(d.available_balance)).catch(console.error);

        const onQueueJoined = () => setGameState('queuing');
        const onMatchReady = () => {
            setGameState('match_ready');
            setTimeout(() => navigate('/arena'), 2000);
        };
        const onMatchFailed = (data) => {
            setGameState('idle');
            alert("Match failed: " + data.message);
        };

        socket.on('queue_joined', onQueueJoined);
        socket.on('match_ready', onMatchReady);
        socket.on('match_failed', onMatchFailed);

        return () => {
            socket.off('queue_joined', onQueueJoined);
            socket.off('match_ready', onMatchReady);
            socket.off('match_failed', onMatchFailed);
        };
    }, [setGameState, currentUser.walletId, navigate]);

    const handleFindMatch = () => {
        setGameState('queuing');
        socket.emit('join_queue', { walletId: currentUser.walletId });
    };

    // Fullscreen Overlay Intercepts
    if (gameState === 'queuing') {
        return (
            <div className="absolute inset-0 z-50 bg-bg-primary flex flex-col items-center justify-center p-6">
                <div className="w-24 h-24 border-4 border-bg-card border-t-accent-brand rounded-full animate-spin mb-8"></div>
                <h2 className="text-3xl font-display font-bold text-text-primary mb-2">Finding Match...</h2>
                <p className="text-text-muted text-sm font-semibold">Matching you with an opponent</p>
                <button
                    onClick={() => setGameState('idle')}
                    className="mt-8 px-6 py-2 bg-bg-card hover:bg-accent-hover text-text-primary hover:text-black rounded font-bold text-sm transition-colors"
                >
                    Cancel Matchmaking
                </button>
            </div>
        );
    }

    if (gameState === 'match_ready') {
        return (
            <div className="absolute inset-0 z-50 bg-bg-primary flex flex-col items-center justify-center">
                <div className="w-32 h-32 mb-8 bg-accent-brand/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-accent-brand" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h2 className="text-4xl font-display font-bold text-text-primary mb-4">Match Found!</h2>
                <p className="text-accent-brand text-lg font-bold tracking-widest uppercase animate-pulse">Routing to Arena...</p>
            </div>
        );
    }

    return (
        <div className="w-full flex-1 flex flex-col">
            {/* Live Activity Ticker */}
            <div className="w-full bg-slate-100 dark:bg-[#0B0E14] border-b border-slate-200 dark:border-[#1e293b] overflow-hidden h-8 relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="inline-flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap text-[10px] font-bold text-slate-500 dark:text-[#94a3b8] tracking-widest uppercase gap-10 items-center">
                        <span>🎉 MotionKing just won <span className="text-[#06b6d4] drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">5,000 CR</span> in Fruit Ninja!</span>
                        <span>🔥 NinjaSlayer hit a <span className="text-[#06b6d4] drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">10x</span> multiplier in Elev8 Roulette!</span>
                        <span>🟢 <span className="text-[#10b981] drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">12,847</span> Players Online</span>
                        <span>💎 AceHigh99 won <span className="text-[#8b5cf6] drop-shadow-[0_0_5px_rgba(139,92,246,0.8)]">8,200 CR</span> in Blackjack Pro!</span>
                        <span>🏆 DiceDevil hit a <span className="text-[#06b6d4] drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">4.2x</span> on Hi-Lo Cards!</span>
                        <span>⚡ FlexGamer cashed out <span className="text-[#10b981] drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">3,750 CR</span> from Beat Dodge!</span>
                        {/* Duplicated for seamless loop */}
                        <span>🎉 MotionKing just won <span className="text-[#06b6d4] drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">5,000 CR</span> in Fruit Ninja!</span>
                        <span>🔥 NinjaSlayer hit a <span className="text-[#06b6d4] drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">10x</span> multiplier in Elev8 Roulette!</span>
                        <span>🟢 <span className="text-[#10b981] drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">12,847</span> Players Online</span>
                        <span>💎 AceHigh99 won <span className="text-[#8b5cf6] drop-shadow-[0_0_5px_rgba(139,92,246,0.8)]">8,200 CR</span> in Blackjack Pro!</span>
                        <span>🏆 DiceDevil hit a <span className="text-[#06b6d4] drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">4.2x</span> on Hi-Lo Cards!</span>
                        <span>⚡ FlexGamer cashed out <span className="text-[#10b981] drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">3,750 CR</span> from Beat Dodge!</span>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-8 max-w-[1600px] w-full mx-auto">

                {/* Web3 Triple Promo Banners */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8">
                    {/* Banner 1: Purple Spotlight */}
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-white dark:from-[#1a0b2e] dark:to-[#0B0E14] shadow-[0_4px_20px_rgba(139,92,246,0.1)] dark:shadow-[0_4px_20px_rgba(139,92,246,0.15)] border border-purple-200/50 dark:border-white/5 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer group min-h-[140px] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.2)] dark:hover:shadow-[0_8px_30px_rgba(139,92,246,0.3)] transition-all duration-300">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]"></div>
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px] group-hover:bg-purple-500/30 transition-colors"></div>
                        <div className="relative z-10 w-full text-center">
                            <h2 className="text-2xl lg:text-3xl font-display font-black text-slate-900 dark:text-white italic tracking-tighter mb-2 uppercase drop-shadow-md">Boost Your Level!</h2>
                            <button className="px-5 py-2 bg-purple-600 text-white dark:bg-white dark:text-[#4c1d95] rounded-full font-black text-[10px] transition-all duration-200 active:scale-95 hover:brightness-110 shadow-lg uppercase tracking-[0.2em] animate-soft-pulse">
                                Claim Boost
                            </button>
                        </div>
                    </div>

                    {/* Banner 2: Cyan Spotlight */}
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-50 to-white dark:from-[#061a1e] dark:to-[#0B0E14] shadow-[0_4px_20px_rgba(6,182,212,0.1)] dark:shadow-[0_4px_20px_rgba(6,182,212,0.15)] border border-cyan-200/50 dark:border-white/5 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer group min-h-[140px] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(6,182,212,0.2)] dark:hover:shadow-[0_8px_30px_rgba(6,182,212,0.3)] transition-all duration-300">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]"></div>
                        <div className="absolute -left-8 -top-8 w-32 h-32 bg-cyan-500/20 rounded-full blur-[40px] group-hover:bg-cyan-500/30 transition-colors"></div>
                        <div className="relative z-10 w-full text-center">
                            <h2 className="text-2xl lg:text-3xl font-display font-black text-slate-900 dark:text-white italic tracking-tighter mb-2 uppercase drop-shadow-md">Whack-a-Mole Takeover</h2>
                            <button className="px-5 py-2 bg-[#06b6d4] text-white dark:bg-[#0B0E14] dark:text-[#06b6d4] rounded-full font-black text-[10px] transition-all duration-200 active:scale-95 hover:brightness-110 shadow-[0_0_15px_rgba(6,182,212,0.4)] uppercase tracking-[0.2em] border border-[#06b6d4]/50 animate-soft-pulse">
                                Play Now
                            </button>
                        </div>
                    </div>

                    {/* Banner 3: Orange/Red Spotlight */}
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-rose-50 to-white dark:from-[#2a0808] dark:to-[#0B0E14] shadow-[0_4px_20px_rgba(244,63,94,0.1)] dark:shadow-[0_4px_20px_rgba(244,63,94,0.15)] border border-rose-200/50 dark:border-white/5 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer group min-h-[140px] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(244,63,94,0.2)] dark:hover:shadow-[0_8px_30px_rgba(244,63,94,0.3)] transition-all duration-300">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-30 mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]"></div>
                        <div className="absolute right-0 top-0 w-24 h-24 bg-rose-500/20 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2 group-hover:bg-rose-500/30 transition-colors"></div>
                        <div className="relative z-10 w-full text-center">
                            <h2 className="text-2xl lg:text-3xl font-display font-black text-slate-900 dark:text-white italic tracking-tighter mb-2 uppercase drop-shadow-md">Elev8 Live Arenas</h2>
                            <button onClick={handleFindMatch} className="px-5 py-2 bg-white text-rose-600 rounded-full font-black text-[10px] transition-all duration-200 active:scale-95 hover:brightness-110 shadow-lg uppercase tracking-[0.2em] animate-soft-pulse">
                                Enter Arena
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sub Nav Links (Shuffle style pills) */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-[#1e293b] text-slate-900 dark:text-white rounded-full text-xs font-bold whitespace-nowrap border border-slate-300 dark:border-white/5 shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] ring-1 ring-slate-200 dark:ring-white/10 transition-all duration-200 active:scale-95 hover:brightness-110">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> Lobby
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-transparent text-slate-500 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e293b]/50 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 hover:brightness-110">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> Originals
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-transparent text-slate-500 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e293b]/50 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 hover:brightness-110">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle></svg> Slots
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-transparent text-slate-500 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e293b]/50 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 active:scale-95 hover:brightness-110">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg> Live Casino
                    </button>
                </div>

                {/* Shuffle Games Grid Section */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-5 px-1 border-b border-slate-200 dark:border-[#1e293b] pb-2">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                            <div className="w-5 h-5 rounded bg-[#8b5cf6] text-white flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                                <span className="text-[10px] font-black italic">S</span>
                            </div>
                            <h2 className="text-sm font-bold tracking-wide">Shuffle Games</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 bg-slate-200 dark:bg-[#1e293b] text-slate-900 dark:text-white rounded text-[10px] font-bold uppercase tracking-wider hover:bg-slate-300 dark:hover:bg-[#2d3748] transition-colors border border-transparent">
                                View all
                            </button>
                            <button className="w-6 h-6 rounded-full bg-slate-200 dark:bg-[#1e293b] hover:bg-slate-300 dark:hover:bg-[#2d3748] flex items-center justify-center text-slate-500 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>
                            <button className="w-6 h-6 rounded-full bg-slate-200 dark:bg-[#1e293b] hover:bg-slate-300 dark:hover:bg-[#2d3748] flex items-center justify-center text-slate-500 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3">
                        {shuffleGames.map(game => (
                            <GameGridCard
                                key={game.id}
                                title={game.title}
                                category={game.category}
                                players={game.players}
                                entryFee={game.entryFee}
                                hot={game.hot}
                                image={game.image}
                                onSelect={handleFindMatch}
                            />
                        ))}
                    </div>
                </div>

                {/* Slots / Live Casino Grid Section */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-5 px-1 border-b border-slate-200 dark:border-[#1e293b] pb-2">
                        <div className="flex items-center gap-2 text-[#8b5cf6]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="4" width="20" height="16" rx="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>
                            <h2 className="text-sm font-bold tracking-wide text-slate-900 dark:text-white">Slots</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 bg-slate-200 dark:bg-[#1e293b] text-slate-900 dark:text-white rounded text-[10px] font-bold uppercase tracking-wider hover:bg-slate-300 dark:hover:bg-[#2d3748] transition-colors border border-transparent">
                                View all
                            </button>
                            <button className="w-6 h-6 rounded-full bg-slate-200 dark:bg-[#1e293b] hover:bg-slate-300 dark:hover:bg-[#2d3748] flex items-center justify-center text-slate-500 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>
                            <button className="w-6 h-6 rounded-full bg-slate-200 dark:bg-[#1e293b] hover:bg-slate-300 dark:hover:bg-[#2d3748] flex items-center justify-center text-slate-500 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3">
                        {slotsLive.map(game => (
                            <GameGridCard
                                key={game.id}
                                title={game.title}
                                category={game.category}
                                players={game.players}
                                entryFee={game.entryFee}
                                hot={game.hot}
                                image={game.image}
                                onSelect={handleFindMatch}
                            />
                        ))}
                    </div>
                </div>

                {/* Quick Stats Block Below Content */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10 pt-4 border-t border-slate-200 dark:border-[#1e293b]">
                    <div className="bg-white dark:bg-[#131722]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm dark:shadow-lg">
                        <div className="w-8 h-8 rounded shrink-0 bg-slate-100 dark:bg-[#1e293b] flex items-center justify-center text-[#8b5cf6]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                        <div>
                            <p className="text-slate-400 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Online Now</p>
                            <p className="text-slate-900 dark:text-white text-lg font-bold tracking-tight dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{platformStats.onlinePlayers}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#131722]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm dark:shadow-lg">
                        <div className="w-8 h-8 rounded shrink-0 bg-slate-100 dark:bg-[#1e293b] flex items-center justify-center text-[#10b981]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        </div>
                        <div>
                            <p className="text-slate-400 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Won Today</p>
                            <p className="text-slate-900 dark:text-white text-lg font-bold tracking-tight dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{platformStats.totalWonToday}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#131722]/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm dark:shadow-lg">
                        <div className="w-8 h-8 rounded shrink-0 bg-slate-100 dark:bg-[#1e293b] flex items-center justify-center text-[#3b82f6]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                        <div>
                            <p className="text-slate-400 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Games Played</p>
                            <p className="text-slate-900 dark:text-white text-lg font-bold tracking-tight dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{platformStats.gamesPlayedToday}</p>
                        </div>
                    </div>
                </div>

                {/* Live Bets Ledger */}
                <LiveBetsTable />

            </div>
        </div>
    );
};

export default GameLobby;
