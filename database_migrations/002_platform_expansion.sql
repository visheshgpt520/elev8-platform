-- 002_platform_expansion.sql
-- Upgrades Elev8 schema to support the 4-tier hierarchy, White-Label UI, and OTP checks.

-- 1. Alter nodes table to expand ENUM options
-- ALTER TABLE nodes MODIFY COLUMN node_type ENUM('Super', 'Master', 'Franchisee', 'Sub_Franchisee') NOT NULL;

-- 2. Alter users table to add phone requirements
-- ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) DEFAULT NULL AFTER email;
-- ALTER TABLE users ADD COLUMN is_phone_verified BOOLEAN DEFAULT FALSE AFTER phone_number;

-- 3. Create node_domains mapping table
CREATE TABLE IF NOT EXISTS node_domains (
    id VARCHAR(36) PRIMARY KEY, -- UUID
    node_id BIGINT NOT NULL,
    domain_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE
);

-- 4. Create node_themes mapping table
CREATE TABLE IF NOT EXISTS node_themes (
    id VARCHAR(36) PRIMARY KEY, -- UUID
    node_id BIGINT NOT NULL,
    primary_color VARCHAR(10) DEFAULT '#1fff20',
    secondary_color VARCHAR(10) DEFAULT '#00f0ff',
    logo_url VARCHAR(255) DEFAULT NULL,
    background_style VARCHAR(50) DEFAULT 'dark_glass',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE
);
