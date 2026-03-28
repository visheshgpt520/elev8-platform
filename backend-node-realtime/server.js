require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const Matchmaker = require('./matchmaker');
const ApiClient = require('./apiClient');

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'token']
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust origins in production 
        methods: ["GET", "POST"]
    }
});

const matchmaker = new Matchmaker();

io.on('connection', (socket) => {
    console.log(`[Socket] New connection: ${socket.id}`);

    // Pre-game Matchmaking Logic
    socket.on('join_queue', async (data) => {
        const { walletId } = data;

        // Attach initial wallet structure to physical socket mapping for quick score_update lookups later
        socket.data = { walletId, roomId: null };

        if (!walletId) {
            socket.emit('error', { message: 'Wallet ID required to join matchmaking queue.' });
            return;
        }

        const match = matchmaker.addPlayer({ socketId: socket.id, walletId });

        if (match) {
            // Unpack matched player sockets
            const [player1Socket, player2Socket] = Object.keys(match.players);
            const player1Wallet = match.players[player1Socket].walletId;
            const player2Wallet = match.players[player2Socket].walletId;

            console.log(`[Server] Initiating PHP fee lock mechanism for Room ${match.roomId}...`);

            // 1. Lock fees via Axios call
            const success = await ApiClient.lockMatchFees(player1Wallet, player2Wallet, match.entryFee);

            if (success) {
                // 2. Fees locked, join both socket rooms safely
                io.sockets.sockets.get(player1Socket)?.join(match.roomId);
                io.sockets.sockets.get(player2Socket)?.join(match.roomId);

                // Set mapping state
                const s1 = io.sockets.sockets.get(player1Socket);
                const s2 = io.sockets.sockets.get(player2Socket);
                if (s1) s1.data.roomId = match.roomId;
                if (s2) s2.data.roomId = match.roomId;

                match.status = 'active';

                // 3. Emit match_ready payload to the players
                io.to(match.roomId).emit('match_ready', {
                    roomId: match.roomId,
                    message: 'Match initialized and fees locked. Good luck!',
                    entryFee: match.entryFee
                });

                console.log(`[Server] Room ${match.roomId} is active and ready.`);
            } else {
                // Fee lock failed (e.g. insufficient funds from one of the players)
                match.status = 'failed';

                io.to(player1Socket).emit('match_failed', { message: 'Queue failed: insufficient match funds or locking timeout.' });
                io.to(player2Socket).emit('match_failed', { message: 'Queue failed: insufficient match funds or locking timeout.' });

                console.log(`[Server] Room ${match.roomId} failed to lock fees. Match aborted.`);
            }
        } else {
            // Pushed into queue, waiting for another player
            socket.emit('queue_joined', { message: 'Waiting for an opponent...' });
        }
    });

    // End-Game Trigger Logic
    socket.on('submit_score', async (data) => {
        const { roomId, score } = data;
        const currentWalletId = socket.data.walletId;

        // Fetch active simulation map from queue store
        const matchMem = matchmaker.activeMatches.get(roomId);
        if (!matchMem || matchMem.status !== 'active') return;

        // Apply new score
        if (matchMem.players[socket.id]) {
            matchMem.players[socket.id].score = score;
        }

        console.log(`[Server] Score updated -> Room: ${roomId} | Wallet: ${currentWalletId} | Score: ${score}`);

        // THE WIN CONDITION: First player to pass 100 points
        if (score >= 100) {
            matchMem.status = 'settling'; // Lock out further score packets 
            console.log(`[Server] Win Threshold Met (Room: ${roomId}) by Wallet: ${currentWalletId}`);

            // Unpack players conceptually to push to PHP API
            const pKeys = Object.keys(matchMem.players);

            let winnerWallet, loserWallet;

            if (pKeys[0] === socket.id) {
                winnerWallet = matchMem.players[pKeys[0]].walletId;
                loserWallet = matchMem.players[pKeys[1]].walletId;
            } else {
                winnerWallet = matchMem.players[pKeys[1]].walletId;
                loserWallet = matchMem.players[pKeys[0]].walletId;
            }

            const totalPool = matchMem.entryFee * 2;

            console.log(`[Server] Triggering Settlement -> Winner: ${winnerWallet}, Loser: ${loserWallet}, Pool: ${totalPool}`);

            // Await API Execution 
            const settled = await ApiClient.triggerMatchSettlement(
                roomId,
                winnerWallet,
                loserWallet,
                totalPool
            );

            if (settled) {
                // Tell clients to end match loop entirely 
                io.to(roomId).emit('match_over', {
                    message: "Match Concluded and Splitted!",
                    winnerWalletId: winnerWallet,
                    amountWon: totalPool * 0.90 // Front-facing conceptual win string (minus 10% platform tax)
                });

                // Teardown the socket sub-pool entirely 
                io.in(roomId).socketsLeave(roomId);
                matchmaker.activeMatches.delete(roomId);
                console.log(`[Server] Room ${roomId} torn down gracefully.`);
            } else {
                io.to(roomId).emit('error', { message: "Internal server distribution hook failed during match orchestration." });
                matchMem.status = 'active'; // In real usage, push into a dead-letter queue; for now un-pause
            }

        } else {
            // Echo score pulse sync back downstream to sync 'opponent' UI values 
            socket.to(roomId).emit('opponent_score_update', { score });
        }
    });

    // Cleanup Logic
    socket.on('disconnect', () => {
        console.log(`[Socket] Disconnected: ${socket.id}`);
        // Remove from pending matchmaking queue immediately
        matchmaker.removePlayer(socket.id);

        // Technically also need logic to handle if they disconnect while in an ACTIVE match room
    });
});

// ==========================================
// POKER NAMESPACE LOGIC
// ==========================================
const pokerIo = io.of('/poker');

pokerIo.on('connection', (socket) => {
    console.log(`[Poker] New connection: ${socket.id}`);

    // Join Table
    socket.on('table-users', (data) => {
        console.log(`[Poker] table-users request:`, data);
        
        // Mock successful table join response
        // Unity PokerJoinTableResponse model expects code & table_data array
        const responseData = {
            message: "Table joined successfully",
            code: 200,
            table_data: [{
                id: "1",
                poker_table_id: data.blind_1 === "25" ? "2" : "1",
                user_id: data.user_id,
                seat_position: "1",
                role: "1",
                game_wallet: "1000",
                added_date: new Date().toISOString(),
                updated_date: new Date().toISOString(),
                isDeleted: "0",
                user_type: "bot",
                name: "Debug Player",
                mobile: "8989587529",
                profile_pic: "",
                wallet: "1000",
                master_boot_value: data.blind_1 || "5"
            }]
        };

        // Send back to the user
        socket.emit('table-users', JSON.stringify(responseData));
        
        // Also fire the trigger to say table is ready
        setTimeout(() => {
            socket.emit('trigger', 'call_status');
        }, 1000);
    });

    // Start Game
    socket.on('start-game', (data) => {
        console.log(`[Poker] start-game request:`, data);
        
        // Unity expects start-game string response
        socket.emit('start-game', JSON.stringify({ message: "Game starting", code: 200 }));
        
        // Then we send a trigger with game_id
        setTimeout(() => {
            const gameId = Math.floor(Math.random() * 100000).toString();
            socket.emit('trigger', gameId);
        }, 1000);
    });

    // Handle Chaal / Raise / Fold (Pack)
    socket.on('chaal', (data) => {
        console.log(`[Poker] chaal received:`, data);
        // Echo back game trigger
        setTimeout(() => {
            socket.emit('trigger', data.game_id);
        }, 500);
    });

    socket.on('pack-game', (data) => {
        console.log(`[Poker] user packed:`, data);
        setTimeout(() => {
            socket.emit('trigger', 'call_status');
        }, 500);
    });

    socket.on('leave-table', (data) => {
        console.log(`[Poker] user left table:`, data);
        socket.emit('leave-table', JSON.stringify({ message: "Left table", code: 200, table_data: [] }));
    });

    socket.on('disconnect', () => {
        console.log(`[Poker] Disconnected: ${socket.id}`);
    });
});


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`-----------------------------------`);
    console.log(`Node.js Realtime Server Running!`);
    console.log(`Port: ${PORT}`);
    console.log(`PHP API Endpoint Tracker: ${process.env.PHP_API_URL}`);
    console.log(`-----------------------------------`);
});
