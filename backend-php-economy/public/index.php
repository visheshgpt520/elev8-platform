<?php

/*
 * CodeIgniter 4 - public/index.php
 * This is the front controller and bootstrap entry point.
 */

// Disable error reporting for production
error_reporting(E_ALL);
ini_set('display_errors', '1');

// CORS — allow all origins (Render + Vercel)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Paths
define('FCPATH', __DIR__ . DIRECTORY_SEPARATOR);
defined('ROOTPATH')   || define('ROOTPATH', realpath(FCPATH . '..') . DIRECTORY_SEPARATOR);
defined('APPPATH')    || define('APPPATH', ROOTPATH . 'app' . DIRECTORY_SEPARATOR);
defined('SYSTEMPATH') || define('SYSTEMPATH', ROOTPATH . 'vendor/codeigniter4/framework/system' . DIRECTORY_SEPARATOR);
defined('WRITEPATH')  || define('WRITEPATH', ROOTPATH . 'writable' . DIRECTORY_SEPARATOR);
defined('ENVIRONMENT') || define('ENVIRONMENT', 'development');

// Load constants early
if (is_file(APPPATH . 'Config/Constants.php')) {
    require_once APPPATH . 'Config/Constants.php';
}

// Load our paths config file
require APPPATH . 'Config/Paths.php';
$paths = new Config\Paths();

// --------------------------------------------------------------------
// BOOT THE APPLICATION
// --------------------------------------------------------------------
require_once SYSTEMPATH . 'Boot.php';
$exitCode = \CodeIgniter\Boot::bootWeb($paths);
exit($exitCode);
