-- 004_node_auth.sql
-- Adds node-level authentication (username/password per node) and display metadata.

-- 1. Node credentials table
CREATE TABLE IF NOT EXISTS node_credentials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    node_id BIGINT NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE
);

-- 2. Add display metadata columns to nodes
-- ALTER TABLE nodes ADD COLUMN display_name VARCHAR(255) DEFAULT NULL AFTER node_type;
-- ALTER TABLE nodes ADD COLUMN display_number VARCHAR(20) DEFAULT NULL AFTER display_name;
-- ALTER TABLE nodes ADD COLUMN location VARCHAR(255) DEFAULT NULL AFTER display_number;

-- 2.5 Seed Super User
INSERT IGNORE INTO users (id, username, email, password_hash) VALUES (1, 'superadmin', 'super@elev8.core', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- 3. Seed the Super node (if not exists)
INSERT INTO nodes (user_id, node_type, display_name, display_number, commission_rate, status, parent_node_id)
SELECT 1, 'Super', 'Platform Super Admin', '0', 100.00, 'active', NULL
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM nodes WHERE node_type = 'Super');

-- 4. Seed Super credentials (username: super, password: super123 hashed with bcrypt)
-- The password hash below is for 'super123' generated via PHP password_hash()
-- We use a placeholder that will be replaced by the seeder script
INSERT INTO node_credentials (node_id, username, password_hash)
SELECT n.id, 'super', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
FROM nodes n
WHERE n.node_type = 'Super'
AND NOT EXISTS (SELECT 1 FROM node_credentials WHERE node_id = n.id);
