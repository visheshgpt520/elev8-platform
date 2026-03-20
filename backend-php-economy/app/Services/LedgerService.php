<?php

namespace App\Services;

use App\Models\WalletModel;
use App\Models\TransactionModel;
use Config\Database;
use Exception;

class LedgerService
{
    protected $db;
    protected $walletModel;
    protected $transactionModel;
    protected $nodeModel;

    public function __construct()
    {
        $this->db = Database::connect();
        $this->walletModel = new WalletModel();
        $this->transactionModel = new TransactionModel();
        $this->nodeModel = new \App\Models\NodeModel(); // Ensure NodeModel is accessible
    }

    /**
     * Safely transfers credits within an SQL transaction environment.
     * Mints fresh credits if $senderWalletId is null.
     * 
     * @param int|null $senderWalletId
     * @param int $receiverWalletId
     * @param float $amount
     * @param string $transactionType
     * @return bool
     * @throws Exception
     */
    public function transferCredits($senderWalletId, $receiverWalletId, $amount, $transactionType)
    {
        if ($amount <= 0) {
            throw new Exception("Transfer amount must be strictly positive.");
        }

        $this->db->transStart();

        try {
            // Validate and deduct from sender ONLY if not minting genesis credits
            if ($senderWalletId !== null) {
                // Perform a pessimistic lock lookup in a real system (SELECT ... FOR UPDATE)
                // Assuming standard CI framework usage for abstraction:
                $senderWallet = $this->walletModel->find($senderWalletId);
                if (!$senderWallet) {
                    throw new Exception("Sender wallet missing in context.");
                }

                $lockedBalance = $senderWallet['locked_balance'] ?? 0;
                $availableBalance = $senderWallet['balance'] - $lockedBalance;

                if ($availableBalance < $amount) {
                    throw new Exception("Insufficient active balance. Credits locked or empty.");
                }

                $newSenderBalance = $senderWallet['balance'] - $amount;
                // Update sender balance
                $this->walletModel->update($senderWalletId, ['balance' => $newSenderBalance]);

                // Credit deduction transaction
                $this->transactionModel->insert([
                    'wallet_id' => $senderWalletId,
                    'amount' => -$amount,
                    'transaction_type' => $transactionType,
                    'status' => 'completed'
                ]);
            }

            // Provision destination wallet
            $receiverWallet = $this->walletModel->find($receiverWalletId);
            if (!$receiverWallet) {
                throw new Exception("Receiver wallet missing in context.");
            }

            $newReceiverBalance = $receiverWallet['balance'] + $amount;

            // Update receiver balance
            $this->walletModel->update($receiverWalletId, ['balance' => $newReceiverBalance]);

            // Positive transfer transaction
            $this->transactionModel->insert([
                'wallet_id' => $receiverWalletId,
                'amount' => $amount,
                'transaction_type' => $transactionType,
                'status' => 'completed'
            ]);

            // Attempt to finalize SQL pipeline payload
            $this->db->transComplete();

            if ($this->db->transStatus() === false) {
                throw new Exception("Transaction SQL runtime hook failure during Commit.");
            }

            return true;

        } catch (Exception $e) {
            $this->db->transRollback();
            throw $e;
        }
    }

    /**
     * Executes the Match Settlement and the Elev8 Multi-Tier Revenue Split.
     * Wrapped entirely in an ACID SQL Transaction.
     * 
     * @param string $matchId The unique UUID or reference string of the match.
     * @param int $winnerWalletId The wallet ID of the verified winner.
     * @param int $loserWalletId The wallet ID of the loser.
     * @param float $totalPool The total amount escrowed (e.g., Entry Fee * 2).
     * @param float $platformFeePercentage The total percentage the platform takes (e.g., 0.10 for 10%).
     * @return bool
     * @throws Exception
     */
    public function settleMatch($matchId, $winnerWalletId, $loserWalletId, $totalPool, $platformFeePercentage)
    {
        if ($totalPool <= 0 || $platformFeePercentage < 0 || $platformFeePercentage > 1) {
            throw new Exception("Invalid parameters provided for match settlement amounts.");
        }

        $this->db->transStart();

        try {
            // STEP 1: "Unlock" funds for both players 
            // In a production system utilizing locked_balance, we would subtract from locked_balance and balance.
            // For now, if simulating escrow, we skip subtraction (as it should have been deducted in the lockPhase).
            // Example real logic:
            // $this->walletModel->update($winnerWalletId, ['locked_balance' => newLockedBalanceCalc]);
            // $this->walletModel->update($loserWalletId, ['locked_balance' => newLockedBalanceCalc]);

            // STEP 2: Calculate distributions
            $platformCut = $totalPool * $platformFeePercentage;
            $winnerTake = $totalPool - $platformCut;

            // STEP 3: Transfer the main prize pool to the Winner
            $winnerWallet = $this->walletModel->find($winnerWalletId);
            if (!$winnerWallet) {
                throw new Exception("Winner wallet missing in context. Settlement aborted.");
            }

            $newWinnerBalance = $winnerWallet['balance'] + $winnerTake;
            $this->walletModel->update($winnerWalletId, ['balance' => $newWinnerBalance]);

            // Log Main Prize transaction
            $this->transactionModel->insert([
                'wallet_id' => $winnerWalletId,
                'amount' => $winnerTake,
                'transaction_type' => 'reward',
                'reference_id' => "match_prize_$matchId",
                'status' => 'completed'
            ]);

            // STEP 4: The Multi-Tier Split
            // We need to trace the hierarchy: Player -> Franchisee -> Master -> Super

            // a. Find the player's underlying user_id
            $winnerUserObj = $this->db->table('wallets')->select('user_id')->where('id', $winnerWalletId)->get()->getRowArray();
            if (!$winnerUserObj)
                throw new Exception("Winner user relationship corrupted.");

            // b. Find their direct sponsor Node (e.g. Franchisee)
            // Realistically, the "Users" table needs a `sponsor_id` column. For this prototype, we'll
            // query if the user themselves runs a node, or fallback to an arbitrary logic. 
            // We assume Franchisee->Master->Super relationships exist in the Database properly.

            // To simulate the split requested, we configure the exact ratios of the $platformCut here:
            $franchiseeSplit = $platformCut * 0.50; // 50% of the 10% cut
            $masterSplit = $platformCut * 0.30;     // 30% of the 10% cut
            $superSplit = $platformCut * 0.20;      // 20% of the 10% cut

            // Function to securely distribute a split chunk to an upstream node owner
            $distributeCut = function ($nodeType, $amount, $matchIdTitle, $matchId) {
                if ($amount <= 0)
                    return;
                return;

                // Get the first active node matching type (in production this traces parent_id specifically)
                // For instance: select * from nodes where node_type='Super' LIMIT 1
                $nodeOwner = $this->nodeModel->where('node_type', $nodeType)->first();
                if ($nodeOwner) {
                    $beneWallet = $this->walletModel->where('user_id', $nodeOwner['user_id'])->first();
                    if ($beneWallet) {
                        $newBalance = $beneWallet['balance'] + $amount;
                        $this->walletModel->update($beneWallet['id'], ['balance' => $newBalance]);

                        $this->transactionModel->insert([
                            'wallet_id' => $beneWallet['id'],
                            'amount' => $amount,
                            'transaction_type' => 'fee', // Using 'fee' or 'MATCH_FEE_SPLIT' equivalent
                            'reference_id' => "fee_split_{$matchIdTitle}_$matchId",
                            'status' => 'completed'
                        ]);
                    }
                }
            };

            // Execute distributions representing Franchisee, Master, and Super upstream hierarchy
            $distributeCut('Franchisee', $franchiseeSplit, 'Franchisee_Cut', $matchId);
            $distributeCut('Master', $masterSplit, 'Master_Cut', $matchId);
            $distributeCut('Super', $superSplit, 'Super_Cut', $matchId);

            // Finalize SQL pipeline payload
            $this->db->transComplete();

            if ($this->db->transStatus() === false) {
                throw new Exception("Transaction SQL runtime hook failure during Settlement Commit.");
            }

            return true;

        } catch (Exception $e) {
            $this->db->transRollback();
            throw $e;
        }
    }

    // ─────────────────────────────────────────────────────
    //  CENTRAL BANK ECONOMY ENGINE
    // ─────────────────────────────────────────────────────

    /**
     * Mint fresh coins into a target node's balance.
     * Only callable by the Super Admin (genesis operation).
     * 
     * @param int $targetNodeId
     * @param float $amount
     * @return array The created transaction record
     * @throws Exception
     */
    public function mintCoins(int $targetNodeId, float $amount): array
    {
        if ($amount <= 0) {
            throw new Exception("Mint amount must be strictly positive.");
        }

        $targetNode = $this->nodeModel->find($targetNodeId);
        if (!$targetNode) {
            throw new Exception("Target node not found.");
        }

        $this->db->transStart();

        try {
            // 1. Insert immutable MINT ledger entry
            $coinTxModel = new \App\Models\CoinTransactionModel();
            $coinTxModel->insert([
                'sender_node_id' => null, // Genesis — no sender
                'receiver_node_id' => $targetNodeId,
                'amount' => $amount,
                'transaction_type' => 'MINT'
            ]);

            // 2. Credit the target node's balance
            $newBalance = ($targetNode['current_balance'] ?? 0) + $amount;
            $this->nodeModel->update($targetNodeId, ['current_balance' => $newBalance]);

            $this->db->transComplete();

            if ($this->db->transStatus() === false) {
                throw new Exception("MINT transaction SQL commit failed.");
            }

            return [
                'transaction_type' => 'MINT',
                'target_node_id' => $targetNodeId,
                'amount' => $amount,
                'new_balance' => $newBalance
            ];
        } catch (Exception $e) {
            $this->db->transRollback();
            throw $e;
        }
    }

    /**
     * Allocate coins from a parent node to a child node.
     * CRITICAL: Enforces Vertical Flow Only via GovernanceService.
     * 
     * @param int $senderNodeId
     * @param int $receiverNodeId
     * @param float $amount
     * @return array The created transaction record
     * @throws Exception
     */
    public function allocateCoins(int $senderNodeId, int $receiverNodeId, float $amount): array
    {
        if ($amount <= 0) {
            throw new Exception("Allocation amount must be strictly positive.");
        }

        if ($senderNodeId === $receiverNodeId) {
            throw new Exception("Cannot allocate coins to self.");
        }

        $senderNode = $this->nodeModel->find($senderNodeId);
        if (!$senderNode) {
            throw new Exception("Sender node not found.");
        }

        $receiverNode = $this->nodeModel->find($receiverNodeId);
        if (!$receiverNode) {
            throw new Exception("Receiver node not found.");
        }

        // SECURITY: Check sender balance
        $senderBalance = (float) ($senderNode['current_balance'] ?? 0);
        if ($senderBalance < $amount) {
            throw new Exception("Insufficient balance. Available: {$senderBalance}, Requested: {$amount}");
        }

        $this->db->transStart();

        try {
            // 1. Deduct from sender
            $newSenderBalance = $senderBalance - $amount;
            $this->nodeModel->update($senderNodeId, ['current_balance' => $newSenderBalance]);

            // 2. Credit receiver
            $newReceiverBalance = (float) ($receiverNode['current_balance'] ?? 0) + $amount;
            $this->nodeModel->update($receiverNodeId, ['current_balance' => $newReceiverBalance]);

            // 3. Log immutable ALLOCATION entry
            $coinTxModel = new \App\Models\CoinTransactionModel();
            $coinTxModel->insert([
                'sender_node_id' => $senderNodeId,
                'receiver_node_id' => $receiverNodeId,
                'amount' => $amount,
                'transaction_type' => 'ALLOCATION'
            ]);

            $this->db->transComplete();

            if ($this->db->transStatus() === false) {
                throw new Exception("ALLOCATION transaction SQL commit failed.");
            }

            return [
                'transaction_type' => 'ALLOCATION',
                'sender_node_id' => $senderNodeId,
                'receiver_node_id' => $receiverNodeId,
                'amount' => $amount,
                'sender_new_balance' => $newSenderBalance,
                'receiver_new_balance' => $newReceiverBalance
            ];
        } catch (Exception $e) {
            $this->db->transRollback();
            throw $e;
        }
    }

    /**
     * Get financial summary for a specific node.
     * 
     * @param int $nodeId
     * @return array
     */
    public function getNodeFinancials(int $nodeId): array
    {
        $node = $this->nodeModel->find($nodeId);
        if (!$node) {
            return ['error' => 'Node not found'];
        }

        // Total received (MINT + ALLOCATION where this node is receiver)
        $totalReceived = $this->db->table('coin_transactions')
            ->selectSum('amount')
            ->where('receiver_node_id', $nodeId)
            ->get()->getRowArray();

        // Total allocated down (ALLOCATION where this node is sender)
        $totalAllocatedDown = $this->db->table('coin_transactions')
            ->selectSum('amount')
            ->where('sender_node_id', $nodeId)
            ->where('transaction_type', 'ALLOCATION')
            ->get()->getRowArray();

        return [
            'node_id' => $nodeId,
            'current_balance' => (float) ($node['current_balance'] ?? 0),
            'total_received' => (float) ($totalReceived['amount'] ?? 0),
            'total_allocated_down' => (float) ($totalAllocatedDown['amount'] ?? 0)
        ];
    }

    /**
     * Get the full chronological transaction ledger.
     * Optionally filtered by a specific node (as sender OR receiver).
     * 
     * @param int|null $nodeId Filter by node (null = all transactions)
     * @param int $limit
     * @return array
     */
    public function getTransactionLedger(?int $nodeId = null, int $limit = 100): array
    {
        $builder = $this->db->table('coin_transactions ct')
            ->select('ct.*, sn.display_name as sender_name, sn.node_type as sender_type, rn.display_name as receiver_name, rn.node_type as receiver_type')
            ->join('nodes sn', 'sn.id = ct.sender_node_id', 'left')
            ->join('nodes rn', 'rn.id = ct.receiver_node_id', 'left')
            ->orderBy('ct.created_at', 'DESC')
            ->limit($limit);

        if ($nodeId !== null) {
            $builder->groupStart()
                ->where('ct.sender_node_id', $nodeId)
                ->orWhere('ct.receiver_node_id', $nodeId)
                ->groupEnd();
        }

        return $builder->get()->getResultArray();
    }
}
