<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

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

// Player and Front-facing API
$routes->group('api/User', function ($routes) {
    $routes->post('login', 'User::login');
    $routes->post('send_otp', 'User::send_otp');
    $routes->options('login', 'User::options');
    $routes->options('send_otp', 'User::options');
});
