<?php

namespace App\Models;

use CodeIgniter\Model;

class NodeCredentialModel extends Model
{
    protected $table = 'node_credentials';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;

    protected $allowedFields = [
        'node_id',
        'username',
        'password_hash'
    ];

    protected $useTimestamps = false;
    protected $createdField = 'created_at';

    protected $validationRules = [
        'node_id' => 'required|integer|is_unique[node_credentials.node_id]',
        'username' => 'required|max_length[100]|is_unique[node_credentials.username]',
        'password_hash' => 'required|max_length[255]'
    ];

    /**
     * Find credentials by username
     */
    public function findByUsername(string $username)
    {
        return $this->where('username', $username)->first();
    }

    /**
     * Find credentials by node_id
     */
    public function findByNodeId(int $nodeId)
    {
        return $this->where('node_id', $nodeId)->first();
    }
}
