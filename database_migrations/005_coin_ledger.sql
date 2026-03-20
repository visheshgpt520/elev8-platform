-- 005_coin_ledger.sql
-- Central Bank monetary distribution ledger for the Elev8 hierarchy.

-- 1. Create the coin_transactions table (immutable ledger)
CREATE TABLE IF NOT EXISTS coin_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_node_id BIGINT NULL,  -- NULL = Super Admin MINT (genesis)
    receiver_node_id BIGINT NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    transaction_type ENUM('MINT', 'ALLOCATION') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_node_id) REFERENCES nodes(id) ON DELETE SET NULL,
    FOREIGN KEY (receiver_node_id) REFERENCES nodes(id) ON DELETE CASCADE
);

-- 2. Add current_balance column to nodes table
ALTER TABLE nodes ADD COLUMN current_balance DECIMAL(18, 2) DEFAULT 0.00 AFTER commission_rate;
