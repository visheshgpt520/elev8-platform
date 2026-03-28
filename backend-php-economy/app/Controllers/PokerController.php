<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class PokerController extends ResourceController
{
    protected $format = 'json';

    /**
     * POST /api/poker/get_table_master
     */
    public function get_table_master()
    {
        // For development/demo, we return hardcoded poker tables
        // To be expanded with DB integration later based on tbl_poker_master
        $tables = [
            [
                "id" => "1",
                "poker_table_id" => "1",
                "boot_value" => "10",
                "city" => "Beginner's Bluff",
                "image" => "demo_table_1.png",
                "image_bg" => "",
                "blind_1" => "5",
                "blind_2" => "10",
                "maximum_blind" => "100",
                "chaal_limit" => "500",
                "pot_limit" => "1000",
                "online_members" => (string)rand(5, 50)
            ],
            [
                "id" => "2",
                "poker_table_id" => "2",
                "boot_value" => "50",
                "city" => "Pro Vegas Lounge",
                "image" => "demo_table_2.png",
                "image_bg" => "",
                "blind_1" => "25",
                "blind_2" => "50",
                "maximum_blind" => "500",
                "chaal_limit" => "2500",
                "pot_limit" => "5000",
                "online_members" => (string)rand(10, 100)
            ],
            [
                "id" => "3",
                "poker_table_id" => "3",
                "boot_value" => "100",
                "city" => "High Roller Room",
                "image" => "demo_table_3.png",
                "image_bg" => "",
                "blind_1" => "50",
                "blind_2" => "100",
                "maximum_blind" => "1000",
                "chaal_limit" => "5000",
                "pot_limit" => "10000",
                "online_members" => (string)rand(2, 20)
            ]
        ];

        return $this->respond([
            'message' => 'Poker tables fetched successfully',
            'code' => 200,
            'table_data' => $tables
        ]);
    }

    /**
     * POST /api/poker/status
     */
    public function status()
    {
        $tableId = $this->request->getVar('poker_table_id') ?? '1';
        $gameId = $this->request->getVar('game_id') ?? '0';

        // Fake response matching Unity's PokerGameData model
        return $this->respond([
            'message' => 'status',
            'code' => 200,
            'table_users' => [],
            'table_detail' => [
                'id' => $tableId,
                'master_table_id' => $tableId,
                'boot_value' => '10',
                'maximum_blind' => '100',
                'chaal_limit' => '500',
                'pot_limit' => '1000',
                'private_table' => '0',
                'added_date' => date('Y-m-d H:i:s'),
                'updated_date' => date('Y-m-d H:i:s'),
                'isDeleted' => '0'
            ],
            'active_game_id' => (int)$gameId,
            'game_status' => 0,
            'table_amount' => 0,
            'last_games' => [],
            'game_log' => [],
            'all_users' => [],
            'game_users' => [],
            'chaal' => "0",
            'middle_card' => [],
            'game_amount' => "0",
            'cards' => [],
            'rabbit_cards' => [],
            'check' => 0,
            'round' => "0",
            'game_gifts' => [],
            'winner_user_id' => ""
        ]);
    }

    /**
     * OPTIONS fix for CORS
     */
    public function options()
    {
        return $this->respond(['status' => 'ok']);
    }
}
