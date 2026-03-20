import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load credentials from .env file in the PHP directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../backend-php-economy/.env') });

const config = {
    host: process.env['database.default.hostname'],
    user: process.env['database.default.username'],
    password: process.env['database.default.password'],
    database: process.env['database.default.database'],
    port: parseInt(process.env['database.default.port'] || '16036'),
    ssl: { rejectUnauthorized: false },
    multipleStatements: true
};

async function run() {
    let connection;
    try {
        console.log('Connecting to Aiven MySQL...');
        connection = await mysql.createConnection(config);
        console.log('✅ Connected.');

        const sqlPath = path.resolve('../database_migrations/005_coin_ledger.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing 005_coin_ledger.sql...');
        await connection.query(sql);
        console.log('✅ Migration 005 complete.');

        // Verify
        const [tables] = await connection.query("SHOW TABLES LIKE 'coin_transactions'");
        console.log('Verification:', tables.length > 0 ? '✅ coin_transactions table exists' : '❌ Table not found');

        const [cols] = await connection.query("SHOW COLUMNS FROM nodes LIKE 'current_balance'");
        console.log('Verification:', cols.length > 0 ? '✅ nodes.current_balance column exists' : '❌ Column not found');

    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        if (connection) await connection.end();
        console.log('Connection closed.');
    }
}

run();
