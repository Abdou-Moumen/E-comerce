<?php

namespace App\Listeners;

use App\Events\NewOrderNotification;
use App\Models\Notification; // Import your Notification model

class CreateNotificationListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\NewOrderNotification  $event
     * @return void
     */
    public function handle(NewOrderNotification $event)
    {
        // Create a new notification record
        $notification = new Notification();
        $notification->user_id = $event->orderData->userId;
        $notification->order_id = $event->orderData->orderId;
        $notification->message = $event->orderData->message;
        $notification->save();
    }
}
