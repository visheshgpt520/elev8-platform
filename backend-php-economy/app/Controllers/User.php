<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use Exception;

class User extends ResourceController
{
    protected $format = 'json';

    /**
     * POST /api/User/login
     */
    public function login()
    {
        $phone = $this->request->getVar('phone_number') ?? $this->request->getVar('phone');
        $password = $this->request->getVar('password');

        // HARDCODED DEBUG LOGIN (Per User Request)
        if ($phone === '123456789' && $password === '123456789') {
            return $this->respond([
                'status'  => 'success',
                'message' => 'Debug Login Successful',
                'data'    => [
                    'id'           => 99999,
                    'username'     => 'debug_player',
                    'phone_number' => '123456789',
                    'coin_balance' => 1000,
                    'token'        => 'debug_session_token_123456789'
                ]
            ]);
        }

        // Real Login Logic (Draft)
        try {
            $userModel = new UserModel();
            $user = $userModel->where('phone_number', $phone)->first();

            if (!$user) {
                return $this->failNotFound('User not found with this phone number.');
            }

            // Simple password check (if they have one)
            // if (password_verify($password, $user['password_hash'])) { ... }

            return $this->failUnauthorized('Invalid credentials. Please use the debug login for testing.');

        } catch (Exception $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    /**
     * POST /api/User/send_otp
     */
    public function send_otp()
    {
        $phone = $this->request->getVar('phone_number') ?? $this->request->getVar('phone');

        // Hardcoded response for debug phone
        if ($phone === '123456789') {
            return $this->respond([
                'status'  => 'success',
                'message' => 'OTP sent to 123456789 (Debug Code: 123456)'
            ]);
        }

        return $this->respond([
            'status'  => 'success',
            'message' => 'OTP request received and processed.'
        ]);
    }

    /**
     * POST /api/User/guest_register
     */
    public function guest_register()
    {
        return $this->respond([
            'status'  => 'success',
            'message' => 'Guest registered successfully (Debug Mode)',
            'data'    => [
                'id' => 99999,
                'username' => 'debug_guest'
            ]
        ]);
    }

    /**
     * OPTIONS fix for CORS if required at controller level
     */
    public function options()
    {
        return $this->respond(['status' => 'ok']);
    }
}
