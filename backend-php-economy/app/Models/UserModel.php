<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table = 'tbl_users';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;

    protected $allowedFields = [
        'name',
        'email',
        'mobile',
        'password',
        'wallet'
    ];

    protected $useTimestamps = false; 

    protected $validationRules = [
        'name' => 'permit_empty|string|min_length[3]',
        'email' => 'permit_empty|valid_email',
        'mobile' => 'permit_empty|max_length[15]',
        'password' => 'permit_empty'
    ];
}
