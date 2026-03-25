<?php

namespace Config;

if (! class_exists(\CodeIgniter\Config\BaseConfig::class, false)) {
    require_once SYSTEMPATH . 'Config/BaseConfig.php';
}

use CodeIgniter\Modules\Modules as BaseModules;

class Modules extends BaseModules
{
    public $enabled = true;
    public $discoverInVendors = true;
    public $aliases = [];
}
