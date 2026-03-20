<?php

namespace App\Models;

use CodeIgniter\Model;

class DomainModel extends Model
{
    protected $table = 'node_domains';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = false; // UUID
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;

    protected $allowedFields = [
        'id',
        'node_id',
        'domain_url',
        'is_primary'
    ];

    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = '';

    protected $validationRules = [
        'id' => 'required|string|max_length[36]',
        'node_id' => 'required|integer',
        'domain_url' => 'required|valid_url|is_unique[node_domains.domain_url]',
        'is_primary' => 'permit_empty|in_list[0,1]'
    ];
}
