<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

@vite('resources/js/app.js')

<body data-user-id="{{ auth()->id() }}">
    <h1>السلام عليكم</h1>
    <script>
        // window.onload = function() {
        //     const userId = document.querySelector('body').getAttribute('data-user-id');
        //     if (userId) {
        //         window.Echo.private(`order-notification.${userId}`)
        //             .listen('.new-order', (notification) => {
        //                 // Handle the new order notification...
        //                 console.log(notification);
        //             });
        //     }
        // }
        window.onload = function() {
            window.Echo.channel('order-notifications')
                .listen('.new-order', (data) => {
                    // Handle the new order notification...
                    console.log('New order notification:', data);
                });
        }
    </script>

    {{-- <script>
        setTimeout(() => {
            window.Echo.channel('testing')
            .listen('.MyTest', (e)=>{
                console.log(e);
            } )
        }, 200);

    </script> --}}
</body>

</html>
