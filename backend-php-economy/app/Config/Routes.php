<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('debug', 'Home::debug');

$routes->group('api/v1', function ($routes) {
    // Multi-tier economy routing logic block
    $routes->post('economy/mint', 'EconomyController::mint');
    $routes->post('economy/allocate', 'EconomyController::allocate');
    $routes->post('economy/transfer', 'EconomyController::transfer');
    $routes->get('economy/balance/(:num)', 'EconomyController::balance/$1');
    $routes->get('economy/network_status', 'EconomyController::networkStatus');
    $routes->post('economy/settle_match', 'EconomyController::settleMatch');
    $routes->post('economy/manual_fiat_settlement', 'EconomyController::manualFiatSettlement');

    // Auth and Security logic block
    $routes->post('auth/verify_otp', 'AuthController::verifyOtp');
    $routes->post('auth/node_login', 'AuthController::nodeLogin');

    // Admin Dashboard logic block
    $routes->group('admin', function ($routes) {
        $routes->get('command', 'SuperAdminController::getCommandCenterMetrics');
        $routes->post('conversion_rate', 'SuperAdminController::updateConversionRate');
        $routes->get('revenue_tree', 'SuperAdminController::getRevenueTree');
        $routes->get('my_tree', 'SuperAdminController::getScopedTree');
        $routes->post('create_node', 'SuperAdminController::createChildNode');
        $routes->post('regenerate_password', 'SuperAdminController::regeneratePassword');
        $routes->post('toggle_node_status', 'SuperAdminController::toggleNodeStatus');
        $routes->post('toggle_user_status', 'SuperAdminController::toggleUserStatus');
    });
});

// Player and Front-facing API (Unity often uses lowercase)
$routes->group('api/user', function ($routes) {
    $routes->post('login', 'User::login');
    $routes->post('send_otp', 'User::send_otp');
    $routes->post('guest_register', 'User::guest_register');
    $routes->post('register', 'User::register');
    $routes->options('(:any)', 'User::options');
});

$routes->group('api/User', function ($routes) {
    $routes->post('login', 'User::login');
    $routes->post('send_otp', 'User::send_otp');
    $routes->post('guest_register', 'User::guest_register');
    $routes->post('register', 'User::register');
    $routes->options('(:any)', 'User::options');
});

// Fallback for Unity legacy calls without /api/v1 prefix
$routes->group('economy', function ($routes) {
    $routes->post('mint', 'EconomyController::mint');
    $routes->post('allocate', 'EconomyController::allocate');
    $routes->post('transfer', 'EconomyController::transfer');
    $routes->get('balance/(:num)', 'EconomyController::balance/$1');
    $routes->get('network_status', 'EconomyController::networkStatus');
    $routes->post('settle_match', 'EconomyController::settleMatch');
    $routes->post('manual_fiat_settlement', 'EconomyController::manualFiatSettlement');
});

// Added APIs for User Profile/Wallet missing endpoints
$routes->group('api/User', function ($routes) {
    $routes->post('profile', 'User::profile');
    $routes->post('wallet', 'User::wallet');
});
$routes->group('api/user', function ($routes) {
    $routes->post('profile', 'User::profile');
    $routes->post('wallet', 'User::wallet');
});

// --------------------------------------------------------------------
// POKER API ENDPOINTS
// --------------------------------------------------------------------
$routes->group('api/poker', ['filter' => 'cors'], function($routes) {
    $routes->post('get_table_master', 'PokerController::get_table_master');
    $routes->post('status', 'PokerController::status');
    $routes->options('(:any)', 'PokerController::options'); // CORS Preflight handling
});
