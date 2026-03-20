<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use App\Models\NodeModel;
use App\Models\NodeCredentialModel;
use Exception;

class AuthController extends ResourceController
{
    /**
     * NODE LOGIN: Authenticate a node operator (Super, Master, Franchisee, etc.)
     * POST /api/v1/auth/node_login
     */
    public function nodeLogin()
    {
        $username = $this->request->getVar('username');
        $password = $this->request->getVar('password');

        if (empty($username) || empty($password)) {
            return $this->failValidationErrors('Required: username, password.');
        }

        try {
            $credModel = new NodeCredentialModel();
            $credential = $credModel->findByUsername($username);

            if (!$credential) {
                return $this->failUnauthorized('Invalid credentials. Access denied.');
            }

            // Verify password against bcrypt hash
            if (!password_verify($password, $credential['password_hash'])) {
                return $this->failUnauthorized('Invalid credentials. Access denied.');
            }

            // Fetch the associated node
            $nodeModel = new NodeModel();
            $node = $nodeModel->find($credential['node_id']);

            if (!$node) {
                return $this->failNotFound('Node record not found.');
            }

            // Check node is not banned or paused
            if ($node['status'] === 'banned') {
                return $this->failForbidden('This node has been banned from the platform.');
            }

            if ($node['status'] === 'paused') {
                return $this->failForbidden('This node is currently paused.');
            }

            return $this->respond([
                'status' => 'success',
                'data' => [
                    'node_id' => (int) $node['id'],
                    'node_type' => $node['node_type'],
                    'display_name' => $node['display_name'],
                    'display_number' => $node['display_number'],
                    'location' => $node['location'],
                    'commission_rate' => $node['commission_rate'],
                    'parent_node_id' => $node['parent_node_id'],
                    'username' => $credential['username']
                ]
            ]);

        } catch (Exception $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    /**
     * OTP Verification Stub
     * POST /api/v1/auth/verify_otp
     */
    public function verifyOtp()
    {
        $phoneNumber = $this->request->getVar('phone_number');
        $otpCode = $this->request->getVar('otp_code');

        if (empty($phoneNumber) || empty($otpCode)) {
            return $this->failValidationError('Required payload: phone_number, otp_code.');
        }

        // Hardcoded stub value
        if ($otpCode !== '123456') {
            return $this->failUnauthorized('Invalid OTP Code submitted.');
        }

        try {
            $userModel = new UserModel();
            $user = $userModel->where('phone_number', $phoneNumber)->first();

            if (!$user) {
                return $this->failNotFound('Phone number not registered to any Elev8 accounts.');
            }

            // Mark phone as verified
            $userModel->update($user['id'], ['is_phone_verified' => true]);

            return $this->respond([
                'status' => 'success',
                'message' => 'OTP Verified. Phone number linked.'
            ]);

        } catch (Exception $e) {
            return $this->failServerError($e->getMessage());
        }
    }
}
