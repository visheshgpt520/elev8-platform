<?php

namespace Config;

/**
 * IMPORTANT: This class should not be edited.
 * File paths configuration for CodeIgniter 4.
 */
class Paths
{
    /**
     * Directory containing the application directory
     */
    public string $appDirectory = ROOTPATH . 'app';

    /**
     * The path to the "system" folder
     */
    public string $systemDirectory = ROOTPATH . 'vendor/codeigniter4/framework/system';

    /**
     * The path to the "writable" directory
     */
    public string $writableDirectory = ROOTPATH . 'writable';

    /**
     * The path to the "tests" directory
     */
    public string $testsDirectory = ROOTPATH . 'tests';

    /**
     * The path to the "views" directory
     */
    public string $viewDirectory = ROOTPATH . 'app/Views';
}
