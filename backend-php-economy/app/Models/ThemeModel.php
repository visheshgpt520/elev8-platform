<?php

namespace App\Models;

use CodeIgniter\Model;

class ThemeModel extends Model
{
    protected $table = 'node_themes';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = false; // UUID
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;

    protected $allowedFields = [
        'id',
        'node_id',
        'primary_color',
        'secondary_color',
        'logo_url',
        'background_style'
    ];

    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    protected $validationRules = [
        'id' => 'required|string|max_length[36]',
        'node_id' => 'required|integer',
        'primary_color' => 'permit_empty|string|max_length[10]',
        'secondary_color' => 'permit_empty|string|max_length[10]',
        'logo_url' => 'permit_empty|valid_url',
        'background_style' => 'permit_empty|string|max_length[50]',
    ];
}
