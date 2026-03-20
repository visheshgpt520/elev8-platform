<?php

namespace App\Services;

use App\Models\NodeModel;
use App\Models\UserModel;
use App\Models\TransactionModel;
use App\Models\GlobalSettingModel;

class SuperAdminService
{
    protected $nodeModel;
    protected $userModel;
    protected $transactionModel;
    protected $settingModel;

    public function __construct()
    {
        $this->nodeModel = new NodeModel();
        $this->userModel = new UserModel();
        $this->transactionModel = new TransactionModel();
        $this->settingModel = new GlobalSettingModel();
    }

    /**
     * Recursive function to scan the entire platform graph.
     * Takes a starting node_id (usually a Master) and maps all children, children-of-children, etc.
     */
    public function buildRecursiveRevenueTree($parentNodeId = null)
    {
        // Find all nodes that report directly to this parent
        $children = $this->nodeModel->where('parent_node_id', $parentNodeId)->findAll();
        $tree = [];

        foreach ($children as $child) {
            $nodeData = [
                'id' => $child['id'],
                'user_id' => $child['user_id'],
                'node_type' => $child['node_type'],
                'commission_rate' => $child['commission_rate'],
                'status' => $child['status'],
                // Fetch simulated revenue metrics (In production, join wallets/transactions)
                'total_revenue' => $this->calculateNodeRevenue($child['id']),
            ];

            // Calculate the specific commission owed based on the node's deal
            $nodeData['commission_owed'] = ($nodeData['total_revenue'] * ($child['commission_rate'] / 100));

            // Recursively dig deeper
            $nodeData['sub_nodes'] = $this->buildRecursiveRevenueTree($child['id']);

            $tree[] = $nodeData;
        }

        return $tree;
    }

    private function calculateNodeRevenue($nodeId)
    {
        // Placeholder total revenue generator: calculates simulated volume based on node id mapping.
        // Replace with actual WalletModel / Transaction SUM() lookups where type = 'fee'
        return 100000 * rand(1, 5) + (int) $nodeId * 5000;
    }

    public function getSystemMetrics()
    {
        $setting = $this->settingModel->find('coin_to_fiat_ratio');
        $conversionRate = $setting ? $setting['setting_value'] : "1.00";

        // Aggregate Player DAU & MAU based on `last_login_at`
        $db = \Config\Database::connect();

        $dauQuery = "SELECT COUNT(*) as dau FROM users WHERE last_login_at >= NOW() - INTERVAL 1 DAY;";
        $mauQuery = "SELECT COUNT(*) as mau FROM users WHERE last_login_at >= NOW() - INTERVAL 30 DAY;";

        $dau = $db->query($dauQuery)->getRow()->dau;
        $mau = $db->query($mauQuery)->getRow()->mau;

        return [
            'conversion_rate' => $conversionRate,
            'dau' => $dau,
            'mau' => $mau,
            'active_lobbies' => rand(12, 120), // Placeholder Real-time Engine Link
            'total_users' => $this->userModel->countAllResults(),
            'total_nodes' => $this->nodeModel->countAllResults()
        ];
    }
}
