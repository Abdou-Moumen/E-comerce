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
            top: 20px;
            right: 20px;
            background-color: #f1f1f1;
            padding: 20px;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            display: none
        }
    </style>
</head>
@vite('resources/js/app.js')
<body data-user-id="{{ auth()->id() }}">

    <div class="div">hiiiiiiiiiiii</div>

    <div class="notification-card">
        <h3>New Order Notification</h3>
        <p>User ID: <span id="user-id"></span></p>
        <p>Order ID: <span id="order-id"></span></p>
        <p>Message: <span id="message"></span></p>
    </div>

    <script>
        window.onload = function() {
    const notificationCard = document.querySelector('.notification-card');

    window.Echo.channel('order-notifications')
        .listen('.new-order', (data) => {
            // Display the notification card

            console.log(data)

            notificationCard.style.display = 'block';

            // Update the card content
            const userIdElement = document.getElementById('user-id');
            const orderIdElement = document.getElementById('order-id');
            const messageElement = document.getElementById('message');

            userIdElement.textContent = data.orderData.userId;
            orderIdElement.textContent = data.orderData.orderId;
            messageElement.textContent = data.orderData.message;

            // Hide the notification after 10 seconds
            setTimeout(() => {
                notificationCard.style.display = 'none';
            }, 10000); // 10 seconds in milliseconds
        });
}

    </script>
</body>
</html>
