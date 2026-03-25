import { io } from 'socket.io-client';

// Target to live backend-node-realtime server on Render
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://elev8-node-realtime-1f5f.onrender.com';

export const socket = io(SOCKET_URL, {
    autoConnect: true,
    transports: ['websocket']
});

socket.on('connect', () => {
    console.log('[Socket] Connect Hook Attached:', socket.id);
});

socket.on('disconnect', () => {
    console.log('[Socket] Disconnect Hook Called');
});
