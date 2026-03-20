<?php

namespace App\Models;

use CodeIgniter\Model;

class GlobalSettingModel extends Model
{
    protected $table = 'global_settings';
    protected $primaryKey = 'setting_key';
    protected $useAutoIncrement = false;
    protected $returnType = 'array';

    protected $allowedFields = ['setting_key', 'setting_value'];

    protected $useTimestamps = true;
    protected $createdField = 'updated_at'; // Schema uses updated_at for this table simply
    protected $updatedField = 'updated_at';
}
