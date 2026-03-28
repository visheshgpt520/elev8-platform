<?php

namespace App\Models;

use CodeIgniter\Model;

class WalletModel extends Model
{
    protected $table = 'tbl_users';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;

    protected $allowedFields = [
        'wallet',
        'unutilized_wallet',
        'winning_wallet',
        'bonus_wallet'
    ];

    protected $useTimestamps = false; // We don't have created_at/updated_at in tbl_users by default

    // Validation rules are not used strictly here, but updating to match
    protected $validationRules = [
        'wallet' => 'numeric'
    ];
}
