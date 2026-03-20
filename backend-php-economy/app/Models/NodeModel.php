<?php

namespace App\Models;

use CodeIgniter\Model;

class NodeModel extends Model
{
    protected $table = 'nodes';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;

    protected $allowedFields = [
        'user_id',
        'node_type',
        'display_name',
        'display_number',
        'location',
        'commission_rate',
        'current_balance',
        'status',
        'parent_node_id'
    ];

    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    protected $validationRules = [
        'user_id' => 'required|integer',
        'node_type' => 'required|max_length[50]',
        'commission_rate' => 'decimal',
        'status' => 'in_list[active,inactive,paused,banned]',
        'parent_node_id' => 'permit_empty|integer'
    ];
}
