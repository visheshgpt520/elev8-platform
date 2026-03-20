<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;

    protected $allowedFields = [
        'username',
        'email',
        'phone_number',
        'is_phone_verified',
        'location_country',
        'location_city',
        'status',
        'password_hash',
        'last_login_at'
    ];

    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    protected $validationRules = [
        'username' => 'required|alpha_numeric_space|min_length[3]|is_unique[users.username]',
        'email' => 'required|valid_email|is_unique[users.email]',
        'phone_number' => 'permit_empty|max_length[20]',
        'status' => 'in_list[active,paused,banned]',
        'password_hash' => 'required'
    ];
}
