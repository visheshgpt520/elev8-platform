const dns = require('dns');
const net = require('net');

const hostname = 'mysql-3d614d7f-lokaworld-5aad.j.aivencloud.com';
const port = 16036;

console.log(`[Diagnostic] Starting DNS lookup for ${hostname}...`);

dns.lookup(hostname, (err, address, family) => {
    if (err) {
        console.error(`[DNS Error] Lookup failed with code: ${err.code}`);
        console.error(`[DNS Error Message]`, err.message);
        return;
    }

    console.log(`[DNS Success] Resolved to address: ${address} (IPv${family})`);
    console.log(`[Diagnostic] Attempting TCP connection to ${address}:${port}...`);

    const socket = new net.Socket();
    socket.setTimeout(5000); // 5 seconds timeout

    socket.connect(port, address, () => {
        console.log(`[TCP Success] Successfully connected to ${address}:${port}`);
        socket.destroy();
    });

    socket.on('error', (err) => {
        console.error(`[TCP Error] Connection failed: ${err.code || err.message}`);
        socket.destroy();
    });

    socket.on('timeout', () => {
        console.error(`[TCP Timeout] Connection timed out after 5000ms`);
        socket.destroy();
    });
});
