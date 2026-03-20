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
            'version' => '1.0.0',
        ]);
    }
}
