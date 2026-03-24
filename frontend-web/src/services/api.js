import axios from 'axios';

// The PHP API Endpoints handled by Render
const PHP_URL = 'https://elev8-php-economy.onrender.com/api/v1';

export const api = axios.create({
    baseURL: PHP_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const EconomyService = {
    // Central Bank: Mint fresh coins to a target Master node (Super Admin only)
    mintCoins: async (targetNodeId, amount) => {
        try {
            const response = await api.post('/economy/mint', { target_node_id: targetNodeId, amount });
            return response.data;
        } catch (error) {
            console.error('API Error minting coins:', error.response?.data || error.message);
            throw error;
        }
    },

    // Allocate coins from parent node to child node (Vertical Flow Only)
    allocateCoins: async (senderNodeId, receiverNodeId, amount) => {
        try {
            const response = await api.post('/economy/allocate', { sender_node_id: senderNodeId, receiver_node_id: receiverNodeId, amount });
            return response.data;
        } catch (error) {
            console.error('API Error allocating coins:', error.response?.data || error.message);
            throw error;
        }
    },

    // Legacy: Mint operation pushing funds to a wallet
    mintCredits: async (amount, superAdminWalletId) => {
        try {
            const response = await api.post('/economy/mint', { amount, super_admin_wallet_id: superAdminWalletId });
            return response.data;
        } catch (error) {
            console.error('API Error minting credits:', error.response?.data || error.message);
            throw error;
        }
    },

    // Standard platform tier transfer
    transferCredits: async (senderId, receiverId, amount) => {
        try {
            const response = await api.post('/economy/transfer', { sender_id: senderId, receiver_id: receiverId, amount });
            return response.data;
        } catch (error) {
            console.error('API Error transferring credits:', error.response?.data || error.message);
            throw error;
        }
    },

    getBalance: async (walletId) => {
        try {
            const response = await api.get(`/economy/balance/${walletId}`);
            return response.data.data;
        } catch (error) {
            // Silently fallback to mock balance when PHP API is offline to prevent console spam
            return 25000;
        }
    },

    // Fetch the live network topology, financials, and transaction ledger
    fetchNetworkData: async (nodeId) => {
        try {
            const response = await api.get(`/economy/network_status${nodeId ? `?node_id=${nodeId}` : ''}`);
            return response.data;
        } catch (error) {
            console.error('API Error fetching network data:', error.response?.data || error.message);
            throw error;
        }
    }
};
