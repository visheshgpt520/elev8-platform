<?php

namespace App\Models;

use CodeIgniter\Model;

class CoinTransactionModel extends Model
{
    protected $table = 'coin_transactions';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;

    protected $allowedFields = [
        'sender_node_id',
        'receiver_node_id',
        'amount',
        'transaction_type'
    ];

    // Immutable ledger — no updated_at
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = '';

    protected $validationRules = [
        'receiver_node_id' => 'required|integer',
        'amount' => 'required|numeric',
        'transaction_type' => 'required|in_list[MINT,ALLOCATION]'
    ];
}
