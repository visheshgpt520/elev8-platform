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

// Ensure the current directory is pointing to the front controller's directory
if (getcwd() !== FCPATH) {
    chdir(FCPATH);
}

// Load our paths config file
require FCPATH . '../app/Config/Paths.php';
$paths = new Config\Paths();

// --------------------------------------------------------------------
// BOOT THE APPLICATION
// --------------------------------------------------------------------
$app = \CodeIgniter\Boot::bootWeb($paths);
$app->run();
