import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
    persist(
        (set) => ({
            // User configuration state
            currentUser: {
                role: 'player', // 'player' or 'superadmin'
                walletId: 1,    // Simulating wallet ID 1
                balance: 0
            },

            // Game lifecycle state
            gameState: 'idle', // 'idle' | 'queuing' | 'match_ready'

            // Admin Auth State
            isAdminAuthenticated: false,

            // Authenticated Node Identity (populated on login)
            adminNode: null,
            // Shape: { node_id, node_type, display_name, display_number, location, commission_rate, parent_node_id, username, theme }

            // Active Theme for the Homepage (fetched from node settings, defaults to 'stake')
            activeTheme: 'stake',

            // Actions
            setCurrentUser: (user) => set((state) => ({ currentUser: { ...state.currentUser, ...user } })),
            setGameState: (newState) => set({ gameState: newState }),
            setAdminAuthenticated: (status) => set({ isAdminAuthenticated: status }),
            setAdminNode: (node) => set({
                adminNode: node,
                isAdminAuthenticated: true,
                activeTheme: node?.theme || 'stake' // Load theme on login
            }),
            logoutAdmin: () => set({ adminNode: null, isAdminAuthenticated: false, activeTheme: 'stake' }),
            setNodeTheme: (newTheme) => set((state) => {
                // In a real app, this would also make an API call to save the preference
                if (state.adminNode) {
                    return {
                        activeTheme: newTheme,
                        adminNode: { ...state.adminNode, theme: newTheme }
                    };
                }
                return { activeTheme: newTheme };
            })
        }),
        {
            name: 'elev8-storage', // name of the item in the storage (must be unique)
            partialize: (state) => ({
                activeTheme: state.activeTheme,
                isAdminAuthenticated: state.isAdminAuthenticated,
                adminNode: state.adminNode
            }), // only persist these fields
        }
    )
);
