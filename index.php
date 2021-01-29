<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="target-densitydpi=device-dpi, width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui" />
    <title>Welcome</title>
    <style>
        @-ms-viewport {
            width: device-width;
        }
    </style>
    <link rel="stylesheet" href="assets/css/reset.min.css">
    <link rel="stylesheet" href="assets/css/w3.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>
    <div id="pano-canvas"></div>
    <div id="ihs-login-form">
        <div id="ihs-login-form-header"><a><i class="material-icons">power</i> Login</a></div>
        <form id="login-form" class="w3-hide" method="post">    
            <div>
                <label for="login-email">Email:</label>
                <input type="email" id="login-email">
            </div>
            <div>
                <label for="login-password">Password:</label>
                <input type="password" id="login-password">
            </div>
            <button type="submit" id="login-submit">Login</button>
        </form>
    </div>
    <div id="ihs-register-form">
        <div id="ihs-register-form-header"><a><i class="material-icons">post_add</i> Register</a></div>
        <form id="register-form" class="w3-hide" method="post">
            <div>
                <label for="register-name">Name:</label>
                <input type="text" id="register-name" required>
            </div>
            <div>
                <label for="register-phone">Phone:</label>
                <input type="text" id="register-phone" required>
            </div>
            <div>
                <label for="register-email">Email:</label>
                <input type="email" id="register-email" required>
            </div>
            <div>
                <label for="register-reemail">Confirm Email:</label>
                <input type="email" id="register-reemail" autocomplete="disable" required>
            </div>
            <div>
                <label for="register-password">Password:</label>
                <input type="password" id="register-password" required>
            </div>
            <div>
                <label for="register-repassword">Confirm Password:</label>
                <input type="password" id="register-repassword" autocomplete="disable" required>
            </div>
            <button type="submit" id="register-submit">Register</button>
        </form>
    </div>
    <div id="ihs-user" class="w3-hide">
        <a href="#" id="user-logout"><i class="material-icons">power_off</i> Log Out</a>
        <div id="user-data"></div>
    </div>

    <script src="assets/js/screenfull.min.js"></script>
    <script src="assets/js/bowser.min.js"></script>
    <script src="assets/js/marzipano.js"></script>
    <script src="assets/js/jquery.js"></script>
    <script src="data/data.js"></script>
    <script src="assets/js/index.js"></script>

    <!-- The core Firebase JS SDK is always required and must be listed first -->
    <script src="https://www.gstatic.com/firebasejs/8.2.4/firebase-app.js"></script>

    <!-- TODO: Add SDKs for Firebase products that you want to use
    https://firebase.google.com/docs/web/setup#available-libraries -->
    <script src="https://www.gstatic.com/firebasejs/8.2.4/firebase-analytics.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.2.4/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.2.4/firebase-database.js"></script>
    <script>
        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        var firebaseConfig = {
            apiKey: "AIzaSyD-iQhsuXqNwf5KQbqe6gcsWx2VaddVdq8",
            authDomain: "cbus-virtualtour.firebaseapp.com",
            databaseURL: "https://cbus-virtualtour-default-rtdb.firebaseio.com/",
            projectId: "cbus-virtualtour",
            storageBucket: "cbus-virtualtour.appspot.com",
            messagingSenderId: "71164967146",
            appId: "1:71164967146:web:a99e456c27eefefef2ff93",
            measurementId: "G-MYGTV8L0YR"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);

        var database = firebase.database();
        firebase.analytics();
    </script>

    <script src="assets/js/fbase.js"></script>
</body>

</html>