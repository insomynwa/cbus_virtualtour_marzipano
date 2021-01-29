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
    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>
    <div id="pano-canvas"></div>

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
    <script>
        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        var firebaseConfig = {
            apiKey: "AIzaSyD-iQhsuXqNwf5KQbqe6gcsWx2VaddVdq8",
            authDomain: "cbus-virtualtour.firebaseapp.com",
            projectId: "cbus-virtualtour",
            storageBucket: "cbus-virtualtour.appspot.com",
            messagingSenderId: "71164967146",
            appId: "1:71164967146:web:a99e456c27eefefef2ff93",
            measurementId: "G-MYGTV8L0YR"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
    </script>

    <script src="assets/js/fbase.js"></script>
</body>

</html>