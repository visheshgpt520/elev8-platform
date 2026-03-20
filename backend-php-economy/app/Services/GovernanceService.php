<?php

namespace App\Services;

use App\Models\NodeModel;

class GovernanceService
{
    /**
     * Verifies if an admin node has authorization over a target node.
     * Recursively traverses up the hierarchy chain. SUPER nodes have universal access.
     * 
     * @param int $adminNodeId
     * @param int $targetNodeId
     * @return bool
     */
    public function canAdministerNode(int $adminNodeId, int $targetNodeId): bool
    {
        $nodeModel = new NodeModel();

        // Self-administration is permitted for their own sub-wallets
        if ($adminNodeId === $targetNodeId) {
            return true;
        }

        $adminNode = $nodeModel->find($adminNodeId);
        if (!$adminNode) {
            return false;
        }

        // Super nodes have universal clearance over the entire platform
        if (strtoupper($adminNode['node_type']) === 'SUPER') {
            return true;
        }

        // Trace the target's lineage upwards
        $currentNodeId = $targetNodeId;

        // Add a hard limit to prevent infinite loops (standard hierarchy is 4 deep)
        $maxDepth = 10;
        $currentDepth = 0;

        while ($currentNodeId != null && $currentDepth < $maxDepth) {
            $currentNode = $nodeModel->find($currentNodeId);

            if (!$currentNode) {
                return false;
            }

            // Target Node's parent matches the Admin Node, chain verified
            if ($currentNode['parent_node_id'] == $adminNodeId) {
                return true;
            }

            // Move one step up the hierarchy tree
            $currentNodeId = $currentNode['parent_node_id'];
            $currentDepth++;
        }

        // Chain broken or max depth reached without matching the admin
        return false;
    }
}
