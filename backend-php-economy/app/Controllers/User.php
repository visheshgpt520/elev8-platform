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
        $phone = (string) ($this->request->getVar('phone_number') ?? $this->request->getVar('phone'));
        $password = (string) $this->request->getVar('password');

        // LOG incoming for debugging
        log_message('debug', "Login Attempt - Phone: $phone, Password: $password");

        // HARDCODED DEBUG LOGIN (Bypass DB entirely)
        if (($phone === '123456789' || $phone === '8989587529') && ($password === '123456789' || $password === '123456')) {
            return $this->respond([
                'status'  => 'success',
                'message' => 'Debug Login Successful',
                'data'    => [
                    'id'           => 99999,
                    'username'     => 'debug_player',
                    'phone_number' => $phone,
                    'coin_balance' => 1000,
                    'token'        => 'debug_session_token_' . $phone
                ]
            ]);
        }

        // Real Login Logic (Try-Catch to prevent 500 crashes)
        try {
            $userModel = new UserModel();
            $user = $userModel->where('mobile', $phone)->first();

            if (!$user) {
                return $this->failNotFound('User not found. Please use the debug login for testing.');
            }

            // Simple plain-text password check (Update if using hashing like password_verify)
            if ($user['password'] !== $password) {
                return $this->failUnauthorized('Invalid credentials.');
            }

            return $this->respond([
                'status'  => 'success',
                'message' => 'Login Successful',
                'data'    => [
                    'id'           => $user['id'],
                    'username'     => $user['name'] ?? 'Player',
                    'phone_number' => $user['mobile'],
                    'coin_balance' => $user['wallet'] ?? 0,
                    'token'        => 'session_token_' . $user['id']
                ]
            ]);

        } catch (Exception $e) {
            log_message('error', "DB Connection Error in Login: " . $e->getMessage());
            return $this->failServerError("Database connectivity issue. Please use debug phone 8989587529 for testing.");
        }
    }

    /**
     * POST /api/User/send_otp
     */
    public function send_otp()
    {
        $phone = $this->request->getVar('phone_number') ?? $this->request->getVar('phone');
        $debugOtp = "123456";

        log_message('debug', "OTP Request for: $phone");

        // Return the OTP code in the response so Unity can "pass" the check
        return $this->respond([
            'status'  => 'success',
            'message' => "OTP request received. For testing, use code: $debugOtp",
            'otp_code' => $debugOtp, // Explicitly pass the code
            'data' => [
                'phone' => $phone,
                'otp' => $debugOtp
            ]
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
