<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewOrderNotification implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    // public $userId;
    public $orderData;

    public function __construct($orderData)
    {
        // $this->userId = $userId;
        $this->orderData = $orderData;
    }

    public function broadcastOn()
    {
        return new Channel('order-notifications');
    }

    public function broadcastAs()
    {
        return 'new-order';
    }
}

// namespace App\Events;
// use Illuminate\Broadcasting\Channel;
// use Illuminate\Broadcasting\InteractsWithSockets;
// use Illuminate\Broadcasting\PresenceChannel;
// use Illuminate\Broadcasting\PrivateChannel;
// use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
// use Illuminate\Foundation\Events\Dispatchable;
// use Illuminate\Queue\SerializesModels;
// use Illuminate\Support\Facades\Auth;

// class NewOrderNotification implements ShouldBroadcast
// {
//     use Dispatchable, SerializesModels;

//     public $userId;
//     public $orderData;

//     public function __construct($userId, $orderData)
//     {
//         $this->userId = $userId;
//         $this->orderData = $orderData;
//     }

//     public function broadcastOn()
//     {
//         return new Channel('order-notification');
//     }
//     // public function broadcastOn()
//     // {
//     //     return new PrivateChannel('order-notification.'.Auth::id());
//     // }

//     public function broadcastAs()
//     {
//         return 'new-order';
//     }
// }
