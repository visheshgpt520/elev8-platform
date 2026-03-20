import React from 'react';

const dummyData = [
    { id: 1, game: 'Fruit Ninja', user: 'MotionKing', time: '6:45 PM', entry: '500 CR', mult: '2.0x', payout: '+1,000 CR', win: true },
    { id: 2, game: 'Elev8 Roulette', user: 'Hidden', time: '6:44 PM', entry: '200 CR', mult: '3.5x', payout: '+700 CR', win: true },
    { id: 3, game: 'Blackjack Pro', user: 'AceHigh99', time: '6:44 PM', entry: '1,000 CR', mult: '0.00x', payout: '0 CR', win: false },
    { id: 4, game: 'Whack-a-Mole', user: 'NinjaSlayer', time: '6:41 PM', entry: '100 CR', mult: '1.9x', payout: '+190 CR', win: true },
    { id: 5, game: "Texas Hold'em", user: 'Hidden', time: '6:39 PM', entry: '2,000 CR', mult: '0.00x', payout: '0 CR', win: false },
    { id: 6, game: 'Hi-Lo Cards', user: 'DiceDevil', time: '6:35 PM', entry: '50 CR', mult: '4.2x', payout: '+210 CR', win: true },
    { id: 7, game: 'Beat Dodge', user: 'FlexGamer', time: '6:33 PM', entry: '150 CR', mult: '1.8x', payout: '+270 CR', win: true },
    { id: 8, game: 'Baccarat Royal', user: 'RouletteQueen', time: '6:30 PM', entry: '500 CR', mult: '0.00x', payout: '0 CR', win: false },
    { id: 9, game: 'Shadow Boxing', user: 'Hidden', time: '6:28 PM', entry: '300 CR', mult: '2.1x', payout: '+630 CR', win: true },
    { id: 10, game: 'Dice Duel', user: 'LuckyRoller', time: '6:25 PM', entry: '75 CR', mult: '5.0x', payout: '+375 CR', win: true },
];

const LiveBetsTable = () => {
    return (
        <div className="w-full mt-16 mb-8">
            <div className="flex items-center gap-4 mb-6 px-2">
                <div className="flex gap-2">
                    <button className="px-5 py-2 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6] text-[#8b5cf6] font-extrabold text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#8b5cf6] shadow-[0_0_8px_rgba(139,92,246,0.8)] animate-pulse"></div>
                        All Bets
                    </button>
                    <button className="px-5 py-2 rounded-full border border-transparent text-slate-500 dark:text-text-muted font-bold text-sm uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all">
                        High Rollers
                    </button>
                    <button className="px-5 py-2 rounded-full border border-transparent flex items-center gap-2 text-slate-500 dark:text-text-muted font-bold text-sm uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        My Bets
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-bg-card backdrop-blur-md rounded-xl overflow-hidden border border-slate-200 dark:border-border-primary shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap min-w-[640px]">
                        <thead className="bg-slate-50 dark:bg-bg-secondary border-b border-slate-200 dark:border-border-primary">
                            <tr>
                                <th className="px-6 py-5 text-slate-500 dark:text-text-muted font-bold uppercase tracking-widest text-[10px]">Game</th>
                                <th className="px-6 py-5 text-slate-500 dark:text-text-muted font-bold uppercase tracking-widest text-[10px]">Player</th>
                                <th className="px-6 py-5 text-slate-500 dark:text-text-muted font-bold uppercase tracking-widest text-[10px]">Time</th>
                                <th className="px-6 py-5 text-right text-slate-500 dark:text-text-muted font-bold uppercase tracking-widest text-[10px]">Wager</th>
                                <th className="px-6 py-5 text-right text-slate-500 dark:text-text-muted font-bold uppercase tracking-widest text-[10px]">Multiplier</th>
                                <th className="px-6 py-5 text-right text-slate-500 dark:text-text-muted font-bold uppercase tracking-widest text-[10px]">Payout</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-border-primary">
                            {dummyData.map((row) => (
                                <tr
                                    key={row.id}
                                    className="group transition-all duration-300 hover:bg-slate-50 dark:hover:bg-bg-secondary"
                                >
                                    <td className="px-6 py-4 text-slate-900 dark:text-white flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-bg-secondary border border-slate-200 dark:border-border-primary flex items-center justify-center shadow-inner group-hover:border-[#8b5cf6]/50 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#8b5cf6] drop-shadow-[0_0_5px_rgba(139,92,246,0.6)]" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                        </div>
                                        <span className="font-extrabold tracking-wide">{row.game}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-text-secondary font-semibold">{row.user}</td>
                                    <td className="px-6 py-4 text-slate-400 dark:text-text-muted opacity-80 font-bold text-xs">{row.time}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="flex items-center justify-end gap-1.5 text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-bg-secondary shadow-sm dark:shadow-inner px-2.5 py-1 rounded-md inline-flex w-max ml-auto border border-slate-200 dark:border-border-primary">
                                            {row.entry}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-text-muted"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="22"></line><line x1="12" y1="2" x2="12" y2="6"></line></svg>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-900 dark:text-white font-extrabold tracking-wide">{row.mult}</td>
                                    <td className={`px-6 py-4 text-right font-black tracking-wide flex justify-end items-center gap-2 ${row.win ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]' : 'text-gray-500'}`}>
                                        {row.payout}
                                        {row.win && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-emerald-400" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="22"></line><line x1="12" y1="2" x2="12" y2="6"></line></svg>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="bg-bg-card border-t border-border-primary py-4 flex justify-center">
                    <button className="text-slate-400 dark:text-text-muted hover:text-slate-900 dark:hover:text-white font-extrabold text-[11px] uppercase tracking-[0.2em] transition-colors py-1 px-4 rounded hover:bg-slate-100 dark:hover:bg-white/5">Load More</button>
                </div>
            </div>
        </div>
    );
};

export default LiveBetsTable;
