-- 003_dashboard_expansion.sql
-- Expands the Elev8 schema to support infinite nodes, settlements, and security states.

-- 1. Alter nodes table to support infinite tier naming conventions and rev shares
-- ALTER TABLE nodes MODIFY COLUMN node_type VARCHAR(50) NOT NULL;
-- ALTER TABLE nodes ADD COLUMN commission_rate DECIMAL(5, 2) DEFAULT 0.00 AFTER node_type;
-- ALTER TABLE nodes MODIFY COLUMN status ENUM('active', 'inactive', 'paused', 'banned') DEFAULT 'active';

-- 2. Create Global Settings table
CREATE TABLE IF NOT EXISTS global_settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default coin to fiat ratio (1 Coin = 1 Rupee)
INSERT INTO global_settings (setting_key, setting_value) VALUES ('coin_to_fiat_ratio', '1.00')
ON DUPLICATE KEY UPDATE setting_value = '1.00';

-- 3. Create Gateway Settlements table
CREATE TABLE IF NOT EXISTS settlements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    from_node_id BIGINT NOT NULL,
    to_node_id BIGINT NOT NULL,
    amount DECIMAL(18, 8) NOT NULL,
    status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
    due_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (from_node_id) REFERENCES nodes(id),
    FOREIGN KEY (to_node_id) REFERENCES nodes(id)
);

-- 4. Alter users table for geolocation and session stickiness
-- ALTER TABLE users ADD COLUMN location_country VARCHAR(100) DEFAULT NULL AFTER email;
-- ALTER TABLE users ADD COLUMN location_city VARCHAR(100) DEFAULT NULL AFTER location_country;
-- ALTER TABLE users ADD COLUMN status ENUM('active', 'paused', 'banned') DEFAULT 'active' AFTER is_phone_verified;
-- ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP NULL AFTER status;
