@extends('layouts.app')
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        .notification-card {
            position: fixed;
            top: 50%;
            right: 20px;
            background-color: #f1f1f1;
            padding: 20px;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            z-index: 9999;
        }
    </style>
</head>

@section('content')
<body data-user-id="{{ auth()->id() }}" >

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">{{ __('Dashboard') }}</div>

                    <div class="card-body">
                        @if (session('status'))
                            <div class="alert alert-success" role="alert">
                                {{ session('status') }}
                            </div>
                        @endif

                        {{ __('You are logged in!') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="notification-card">
        <h3>New Order Notification</h3>
        <p>User ID: <span id="user-id"></span></p>
        <p>Order ID: <span id="order-id"></span></p>
        <p>Message: <span id="message"></span></p>
    </div>

</body>

@vite('resources/js/app.js')
<script>
window.onload = function() {
    const notificationCard = document.querySelector('.notification-card');
    const userId = document.body.dataset.userId; // Get the current user's ID

    console.log(userId)

    window.Echo.channel('order-notifications')
        .listen('.new-order', (data) => {

            console.log(data.orderData.userId)
            console.log('Received event:', data);

            // Check if the event is intended for the current user
            // if (data.orderData.userId === userId) {
                // Display the notification card
                console.log(data);
                notificationCard.style.display = 'block';

                // Update the card content
                const userIdElement = document.getElementById('user-id');
                const orderIdElement = document.getElementById('order-id');
                const messageElement = document.getElementById('message');
                userIdElement.textContent = data.orderData.userId;
                orderIdElement.textContent = data.orderData.orderId;
                messageElement.textContent = data.orderData.message;

                // // Hide the notification after 10 seconds
                // setTimeout(() => {
                //     notificationCard.style.display = 'none';
                // }, 10000); // 10 seconds in milliseconds
            // }
        });
}
</script>

@endsection
