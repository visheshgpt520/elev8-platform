<?php

namespace App\Controllers;

use CodeIgniter\Controller;

class Home extends Controller
{
    public function index(): string
    {
        return json_encode([
            'status'  => 'ok',
            'service' => 'ELEV8 PHP Economy API',
            'version' => '1.0.1', // Verify deployment
        ]);
    }

    public function debug(): string
    {
        return json_encode([
            'environment' => [
                'ENVIRONMENT' => ENVIRONMENT,
                'CI_ENVIRONMENT' => getenv('CI_ENVIRONMENT'),
            ],
            'database_config' => [
                'hostname' => config('Database')->default['hostname'],
            ],
        ]);
    }
}
