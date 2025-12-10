<?php

namespace App\Data;

class OrderData
{
    public $userId;
    public $orderId;
    public $message;

    public function __construct($userId, $orderId, $message)
    {
        $this->userId = $userId;
        $this->orderId = $orderId;
        $this->message = $message;
    }
}
