<?php

namespace App\Models;

use CodeIgniter\Model;

class TransactionModel extends Model
{
    protected $table = 'transactions';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;

    protected $allowedFields = [
        'wallet_id',
        'amount',
        'transaction_type',
        'reference_id',
        'status'
    ];

    // Transactions are an immutable ledger, no updated_at column
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = '';

    protected $validationRules = [
        'wallet_id' => 'required|integer',
        'amount' => 'required|numeric',
        'transaction_type' => 'required|in_list[deposit,withdrawal,transfer,fee,reward]',
        'status' => 'in_list[pending,completed,failed]'
    ];
}
