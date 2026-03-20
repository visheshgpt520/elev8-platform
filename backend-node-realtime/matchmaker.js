const { v4: uuidv4 } = require('uuid');

class Matchmaker {
    constructor() {
        // The matchmaking queue: stores pending player objects
        this.queue = [];

        // Active matches map
        this.activeMatches = new Map();
    }

    /**
     * Adds a player to the matchmaking queue.
     * If another player exists, it extracts them and returns a Match object.
     * 
     * @param {Object} player - { socketId, walletId }
     * @returns {Object|null} - Null if queued, Match object if match found
     */
    addPlayer(player) {
        // Prevent adding a player already in the queue or in a match
        if (this.queue.find(p => p.walletId === player.walletId || p.socketId === player.socketId)) {
            console.log(`[Matchmaker] Player ${player.walletId} already in queue.`);
            return null;
        }

        // Add player to the end of the FIFO queue
        this.queue.push(player);
        console.log(`[Matchmaker] Queued Player ${player.walletId}. Players waiting: ${this.queue.length}`);

        // Try to form a match
        return this.tryMatchmaking();
    }

    /**
     * Attempts to pop two players off the queue to form a match.
     */
    tryMatchmaking() {
        if (this.queue.length >= 2) {
            // Extract the two longest-waiting players
            const player1 = this.queue.shift();
            const player2 = this.queue.shift();

            const roomId = uuidv4();

            const match = {
                roomId,
                players: {
                    [player1.socketId]: { walletId: player1.walletId, status: 'ready', score: 0 },
                    [player2.socketId]: { walletId: player2.walletId, status: 'ready', score: 0 }
                },
                entryFee: 100, // Fixed entry fee for this prototype example
                status: 'pre-match'
            };

            this.activeMatches.set(roomId, match);

            console.log(`[Matchmaker] Match Found! Room ID: ${roomId} (Wallets: ${player1.walletId} vs ${player2.walletId})`);
            return match;
        }

        return null;
    }

    /**
     * Removes a player from the pending queue (e.g. if they disconnect)
     * @param {string} socketId 
     */
    removePlayer(socketId) {
        const initialLength = this.queue.length;
        this.queue = this.queue.filter(p => p.socketId !== socketId);

        if (this.queue.length !== initialLength) {
            console.log(`[Matchmaker] Removed socket ${socketId} from queue.`);
        }
    }
}

module.exports = Matchmaker;
