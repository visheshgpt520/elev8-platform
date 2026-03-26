<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class App extends BaseConfig
{
    // Base URL — Render injects this via environment in production
    public string $baseURL = 'http://localhost:8080/';

    // Allowed Hostnames in the site URI
    public array $allowedHostnames = [];

    // Index page (empty for clean URLs via Apache mod_rewrite)
    public string $indexPage = '';

    // URI Protocol
    public string $uriProtocol = 'REQUEST_URI';

    // Default locale
    public string $defaultLocale = 'en';

    // Negotiate locale
    public bool $negotiateLocale = false;

    // Supported locales
    public array $supportedLocales = ['en'];

    // App timezone
    public string $appTimezone = 'UTC';

    // Charset
    public string $charset = 'UTF-8';

    // Force global secure requests
    public bool $forceGlobalSecureRequests = false;

    // Proxy IPs (blank by default)
    public string|array $proxyIPs = '';

    // Session driver
    public string $sessionDriver            = 'CodeIgniter\Session\Handlers\FileHandler';
    public string $sessionCookieName        = 'ci_session';
    public int    $sessionExpiration        = 7200;
    public string $sessionSavePath         = WRITEPATH . 'session';
    public bool   $sessionMatchIP           = false;
    public int    $sessionTimeToUpdate      = 300;
    public bool   $sessionRegenerateDestroy = false;

    // Cookie settings
    public string $cookiePrefix   = '';
    public string $cookieDomain   = '';
    public string $cookiePath     = '/';
    public bool   $cookieSecure   = false;
    public bool   $cookieHTTPOnly = false;
    public string $cookieSameSite = 'Lax';

    // Reverse proxy support
    public string $reverseProxyIPs = '';

    // CSP
    public bool $CSPEnabled = false;
}
