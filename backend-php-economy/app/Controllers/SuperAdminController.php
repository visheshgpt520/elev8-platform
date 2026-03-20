<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Services\SuperAdminService;
use App\Services\GovernanceService;
use App\Models\GlobalSettingModel;
use App\Models\NodeModel;
use App\Models\NodeCredentialModel;
use App\Models\UserModel;

class SuperAdminController extends ResourceController
{
    protected $format = 'json';
    protected $superAdminService;
    protected $governanceService;

    public function __construct()
    {
        $this->superAdminService = new SuperAdminService();
        $this->governanceService = new GovernanceService();
    }

    /**
     * COMMAND CENTER: GET GLOBAL METRICS
     * GET /api/v1/admin/command
     */
    public function getCommandCenterMetrics()
    {
        $metrics = $this->superAdminService->getSystemMetrics();

        return $this->respond([
            'status' => 'success',
            'data' => $metrics
        ]);
    }

    /**
     * COMMAND CENTER: UPDATE CONVERSION RATE
     * POST /api/v1/admin/conversion_rate
     */
    public function updateConversionRate()
    {
        $newRatio = $this->request->getVar('coin_to_fiat_ratio');

        if (!$newRatio || !is_numeric($newRatio)) {
            return $this->failValidationErrors('Invalid ratio value.');
        }

        $settings = new GlobalSettingModel();
        $settings->where('setting_key', 'coin_to_fiat_ratio')->set(['setting_value' => $newRatio])->update();

        return $this->respond([
            'status' => 'success',
            'message' => 'Conversion Rate Updated',
            'new_ratio' => $newRatio
        ]);
    }

    /**
     * REVENUE CENTER: RECURSIVE HIERARCHY TREE (full platform)
     * GET /api/v1/admin/revenue_tree
     */
    public function getRevenueTree()
    {
        $fullTree = $this->superAdminService->buildRecursiveRevenueTree(null);

        return $this->respond([
            'status' => 'success',
            'data' => $fullTree
        ]);
    }

    /**
     * REVENUE CENTER: SCOPED TREE (from a specific node downward)
     * GET /api/v1/admin/my_tree?node_id=X
     */
    public function getScopedTree()
    {
        $nodeId = $this->request->getGet('node_id');

        if (!$nodeId) {
            return $this->failValidationErrors('Required: node_id');
        }

        $nodeModel = new NodeModel();
        $node = $nodeModel->find($nodeId);

        if (!$node) {
            return $this->failNotFound('Node not found.');
        }

        // For Super nodes, return the full tree from root
        if (strtoupper($node['node_type']) === 'SUPER') {
            $tree = $this->superAdminService->buildRecursiveRevenueTree(null);
        } else {
            // Return only children of this node
            $tree = $this->superAdminService->buildRecursiveRevenueTree($nodeId);
        }

        return $this->respond([
            'status' => 'success',
            'data' => $tree
        ]);
    }

    /**
     * CREATE CHILD NODE
     * POST /api/v1/admin/create_node
     * 
     * Creates a new node under the authenticated node.
     * Super creates Masters, Masters create Franchisees, etc.
     */
    public function createChildNode()
    {
        $parentNodeId = $this->request->getVar('parent_node_id');
        $displayName = $this->request->getVar('display_name');
        $location = $this->request->getVar('location');
        $username = $this->request->getVar('username');
        $password = $this->request->getVar('password');
        $commissionRate = $this->request->getVar('commission_rate') ?? 10.00;

        if (!$parentNodeId || !$displayName || !$username || !$password) {
            return $this->failValidationErrors('Required: parent_node_id, display_name, username, password');
        }

        $nodeModel = new NodeModel();
        $credModel = new NodeCredentialModel();

        // Verify parent exists
        $parentNode = $nodeModel->find($parentNodeId);
        if (!$parentNode) {
            return $this->failNotFound('Parent node not found.');
        }

        // Determine child tier type
        $childType = $this->getChildTierType($parentNode['node_type']);

        // Auto-generate the display_number based on existing siblings
        $existingSiblings = $nodeModel->where('parent_node_id', $parentNodeId)->countAllResults();
        $displayNumber = $this->generateDisplayNumber($parentNode, $existingSiblings + 1);

        // Check username uniqueness
        $existingCred = $credModel->findByUsername($username);
        if ($existingCred) {
            return $this->failValidationErrors('Username already taken. Choose another.');
        }

        // Create a placeholder user entry for the node operator
        $userModel = new UserModel();
        $userId = $userModel->insert([
            'username' => $username . '_node_op',
            'email' => $username . '@node.elev8.local',
            'password_hash' => password_hash($password, PASSWORD_BCRYPT)
        ]);

        // Create the node
        $nodeId = $nodeModel->insert([
            'user_id' => $userId,
            'node_type' => $childType,
            'display_name' => $displayName,
            'display_number' => $displayNumber,
            'location' => $location ?? '',
            'commission_rate' => (float) $commissionRate,
            'status' => 'active',
            'parent_node_id' => $parentNodeId
        ]);

        // Create credentials
        $credModel->insert([
            'node_id' => $nodeId,
            'username' => $username,
            'password_hash' => password_hash($password, PASSWORD_BCRYPT)
        ]);

        return $this->respond([
            'status' => 'success',
            'message' => "$childType created successfully.",
            'data' => [
                'node_id' => $nodeId,
                'node_type' => $childType,
                'display_name' => $displayName,
                'display_number' => $displayNumber,
                'location' => $location,
                'username' => $username,
                'password' => $password  // Show once on creation
            ]
        ]);
    }

    /**
     * REGENERATE PASSWORD for a child node
     * POST /api/v1/admin/regenerate_password
     */
    public function regeneratePassword()
    {
        $adminNodeId = $this->request->getVar('admin_node_id');
        $targetNodeId = $this->request->getVar('target_node_id');

        if (!$adminNodeId || !$targetNodeId) {
            return $this->failValidationErrors('Required: admin_node_id, target_node_id');
        }

        // Verify governance chain
        if (!$this->governanceService->canAdministerNode((int) $adminNodeId, (int) $targetNodeId)) {
            return $this->failForbidden('You do not have authority over this node.');
        }

        // Generate a new random password
        $newPassword = $this->generateSecurePassword();

        $credModel = new NodeCredentialModel();
        $credential = $credModel->findByNodeId((int) $targetNodeId);

        if (!$credential) {
            return $this->failNotFound('No credentials found for this node.');
        }

        // Update the password hash
        $credModel->update($credential['id'], [
            'password_hash' => password_hash($newPassword, PASSWORD_BCRYPT)
        ]);

        return $this->respond([
            'status' => 'success',
            'message' => 'Password regenerated successfully.',
            'data' => [
                'target_node_id' => $targetNodeId,
                'new_password' => $newPassword  // Show once
            ]
        ]);
    }

    /**
     * SECURITY CENTER: TOGGLE NODE STATUS
     * POST /api/v1/admin/toggle_node_status
     */
    public function toggleNodeStatus()
    {
        $nodeId = $this->request->getVar('node_id');
        $newStatus = $this->request->getVar('status');

        if (!in_array($newStatus, ['active', 'paused', 'banned'])) {
            return $this->failValidationErrors('Invalid status mapping');
        }

        $nodeModel = new NodeModel();
        $nodeModel->update($nodeId, ['status' => $newStatus]);

        return $this->respond([
            'status' => 'success',
            'message' => "Node $nodeId Status Updated to $newStatus"
        ]);
    }

    /**
     * SECURITY CENTER: TOGGLE USER STATUS
     * POST /api/v1/admin/toggle_user_status
     */
    public function toggleUserStatus()
    {
        $userId = $this->request->getVar('user_id');
        $newStatus = $this->request->getVar('status');

        if (!in_array($newStatus, ['active', 'paused', 'banned'])) {
            return $this->failValidationErrors('Invalid status mapping');
        }

        $userModel = new UserModel();
        $userModel->update($userId, ['status' => $newStatus]);

        return $this->respond([
            'status' => 'success',
            'message' => "User $userId Status Updated to $newStatus"
        ]);
    }

    // ---------- HELPERS ----------

    /**
     * Determine the child tier type based on parent type
     */
    private function getChildTierType(string $parentType): string
    {
        $tierMap = [
            'Super' => 'Master',
            'Master' => 'Franchisee',
            'Franchisee' => 'Sub_Franchisee',
        ];

        // For any deeper tier (Sub_Franchisee, Sub_Sub_Franchisee, etc.)
        // prepend "Sub_" to the parent type
        if (isset($tierMap[$parentType])) {
            return $tierMap[$parentType];
        }

        return 'Sub_' . $parentType;
    }

    /**
     * Generate display number for a new node based on parent hierarchy
     * E.g., Master 1's 3rd Franchisee = "1.3", Franchisee 1.2's 1st Sub = "1.2.1"
     */
    private function generateDisplayNumber($parentNode, int $siblingIndex): string
    {
        if (strtoupper($parentNode['node_type']) === 'SUPER') {
            return (string) $siblingIndex;
        }

        $parentNumber = $parentNode['display_number'] ?? '';
        return $parentNumber . '.' . $siblingIndex;
    }

    /**
     * Generate a secure random password
     */
    private function generateSecurePassword(int $length = 12): string
    {
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
        $password = '';
        for ($i = 0; $i < $length; $i++) {
            $password .= $chars[random_int(0, strlen($chars) - 1)];
        }
        return $password;
    }
}
