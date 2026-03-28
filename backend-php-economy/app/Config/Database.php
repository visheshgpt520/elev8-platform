<?php

namespace Config;

use CodeIgniter\Database\Config;

class Database extends Config
{
    public string $filesPath = APPPATH . 'Database' . DIRECTORY_SEPARATOR;

    public string $defaultGroup = 'default';

    // Default connection — structure defined here, values populated in constructor
    public array $default = [
        'DSN'          => '',
        'hostname'     => '127.0.0.1', // Placeholder
        'username'     => 'root',      // Placeholder
        'password'     => '',          // Placeholder
        'database'     => 'elev8',     // Placeholder
        'DBDriver'     => 'MySQLi',
        'DBPrefix'     => '',
        'pConnect'     => false,
        'DBDebug'      => true,
        'charset'      => 'utf8mb4',
        'DBCollat'     => 'utf8mb4_general_ci',
        'swapPre'      => '',
        'encrypt'      => false,
        'compress'     => false,
        'strictOn'     => false,
        'failover'     => [],
        'port'         => 3306,        // Placeholder
        'numberNative' => false,
    ];

    public function __construct()
    {
        parent::__construct();

        // Populate dynamic values from environment variables
        $this->default['hostname'] = getenv('DB_HOSTNAME') ?: '34.180.29.69';
        $this->default['username'] = getenv('DB_USERNAME') ?: 'avnadmin';
        $this->default['password'] = getenv('DB_PASSWORD') ?: '';
        $this->default['database'] = getenv('DB_DATABASE') ?: 'defaultdb';
        $this->default['port']     = getenv('DB_PORT')     ?: 15772;
        $this->default['DBDebug']  = (ENVIRONMENT !== 'production');
    }

    public array $tests = [
        'DSN'          => '',
        'hostname'     => '127.0.0.1',
        'username'     => 'root',
        'password'     => '',
        'database'     => 'elev8_test',
        'DBDriver'     => 'MySQLi',
        'DBPrefix'     => 'tests_',
        'pConnect'     => false,
        'DBDebug'      => true,
        'charset'      => 'utf8mb4',
        'DBCollat'     => 'utf8mb4_general_ci',
        'swapPre'      => '',
        'encrypt'      => false,
        'compress'     => false,
        'strictOn'     => false,
        'failover'     => [],
        'port'         => 3306,
        'numberNative' => false,
    ];
}
