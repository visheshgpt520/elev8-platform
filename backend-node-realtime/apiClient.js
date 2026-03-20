const axios = require('axios');
require('dotenv').config();

const PHP_API_URL = process.env.PHP_API_URL || 'http://localhost:8080/api/v1';

class ApiClient {
    /**
     * Calls the PHP CodeIgniter backend to lock the entry fees for a match.
     * This acts as an escrow before the match truly begins.
     * 
     * @param {number} player1Wallet - The ID of Player 1's wallet
     * @param {number} player2Wallet - The ID of Player 2's wallet
     * @param {number} entryFee      - The entry fee per player
     * @returns {Promise<boolean>}   - True if both fees locked successfully
     */
    static async lockMatchFees(player1Wallet, player2Wallet, entryFee) {
        try {
            // Note: In a production scenario, you would want an atomic bulk escrow 
            // endpoint on the PHP side to handle both wallets simultaneously or fail entirely.
            // For now, we simulate locking logic by transferring credits to an internal "house" escrow wallet, 
            // or by triggering a specialized "lock" transaction if implemented in PHP.

            // Example simulated structure for calling an escrow endpoint:
            /*
            const response = await axios.post(`${PHP_API_URL}/economy/escrow`, {
                wallets: [player1Wallet, player2Wallet],
                amount: entryFee,
                match_reference: `match_${Date.now()}`
            });
            return response.data.status === 'success';
            */

            console.log(`[ApiClient] Locking fees: ${entryFee} credits for Wallets [${player1Wallet}, ${player2Wallet}] via ${PHP_API_URL}`);

            // Simulating success for the prototype phase as requested
            return true;

        } catch (error) {
            console.error('[ApiClientError] Failed to lock match fees:', error.message);
            if (error.response) {
                console.error('[ApiClientError] PHP response:', error.response.data);
            }
            return false;
        }
    }

    /**
     * Reaches securely out to the PHP backend to trigger the multi-tier revenue 
     * split algorithm logic upon an active match ending. 
     * 
     * @param {string} matchId The room ID or unique match identifier
     * @param {number} winnerWallet The ID of the winner's wallet
     * @param {number} loserWallet The ID of the loser's wallet
     * @param {number} totalPool Total escrowed credits to split (Winner Take + Platform Cut)
     */
    static async triggerMatchSettlement(matchId, winnerWallet, loserWallet, totalPool) {
        try {
            console.log(`[ApiClient] Requesting Settlement Sequence for Match: ${matchId}`);
            const response = await axios.post(`${PHP_API_URL}/economy/settle_match`, {
                match_id: matchId,
                winner_wallet_id: winnerWallet,
                loser_wallet_id: loserWallet,
                total_pool: totalPool,
                platform_fee_percentage: 0.10 // 10% Platform tax orchestrator
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.SERVICE_API_KEY}`
                }
            });

            console.log(`[ApiClient] Settlement Successful:`, response.data.message);
            return true;

        } catch (error) {
            console.error('[ApiClientError] Match Settlement Failure:', error.message);
            if (error.response) {
                console.error('[ApiClientError] PHP context output:', error.response.data);
            }
            return false;
        }
    }

    // Example handler for end game payouts if needed later
    static async payoutMatch(winnerWallet, loserWallet, totalPrize) {
        // Axios call to PHP backend to distribute the prize pool
    }
}

module.exports = ApiClient;
