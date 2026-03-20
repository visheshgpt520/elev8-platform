<?php

namespace Config;

use App\Filters\CorsFilter;
use CodeIgniter\Config\BaseConfig;

class Filters extends BaseConfig
{
    /**
     * Configures aliases for Filter classes to
     * make reading the routes file easier.
     */
    public array $aliases = [
        'cors' => CorsFilter::class,
    ];

    /**
     * List of filter aliases that are always
     * applied before and after every request.
     */
    public array $globals = [
        'before' => [
            'cors',
        ],
        'after' => [],
    ];

    /**
     * List of filter aliases that work on one
     * particular HTTP method (GET, POST, etc.)
     */
    public array $methods = [];

    /**
     * List of filter aliases that should run on any
     * before or after URI patterns.
     */
    public array $filters = [];
}
