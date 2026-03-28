<?php

namespace Config;

use CodeIgniter\Database\Config;

class Database extends Config
{
    public string $filesPath = APPPATH . 'Database' . DIRECTORY_SEPARATOR;

    public string $defaultGroup = 'default';

    // Default connection — values pulled from .env / Render environment variables
    public array $default = [
        'DSN'          => '',
        'hostname'     => getenv('database.default.hostname') ?: '34.180.29.69',
        'username'     => getenv('database.default.username') ?: 'avnadmin',
        'password'     => getenv('database.default.password') ?: '',
        'database'     => getenv('database.default.database') ?: 'defaultdb',
        'DBDriver'     => 'MySQLi',
        'DBPrefix'     => '',
        'pConnect'     => false,
        'DBDebug'      => (ENVIRONMENT !== 'production'),
        'charset'      => 'utf8mb4',
        'DBCollat'     => 'utf8mb4_general_ci',
        'swapPre'      => '',
        'encrypt'      => false,
        'compress'     => false,
        'strictOn'     => false,
        'failover'     => [],
        'port'         => getenv('database.default.port') ?: 15772,
        'numberNative' => false,
    ];

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
