"use strict";

$(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $("#ihs-login-form").removeClass("w3-show").addClass("w3-hide");
            $("#ihs-register-form").removeClass("w3-show").addClass("w3-hide");

            $("#ihs-user").removeClass("w3-hide").addClass("w3-show");
            firebase.database().ref('/users/' + user.uid).once('value')
            .then((snapshot) => {
                var name = (snapshot.val() && snapshot.val().name) || 'Anonymous';
                $("#user-data").append("<p>"+ name + "</p>");
            });

        } else {
            $("#ihs-login-form").removeClass("w3-hide").addClass("w3-show");
            $("#ihs-register-form").removeClass("w3-hide").addClass("w3-show");
            $("#ihs-user").removeClass("w3-show").addClass("w3-hide");
        }
    });

    $("#login-form").submit(function (e) {
        e.preventDefault();
        var email = $("#login-email").val();
        var password = $("#login-password").val();

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                var user = userCredential.user;
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage);
            });
    });

    $("#register-form").submit(function (e) {
        e.preventDefault();
        var name = $("#register-name").val();
        var phone = $("#register-phone").val();
        var email = $("#register-email").val();
        var reemail = $("#register-reemail").val();
        var password = $("#register-password").val();

        if (name.trim().length < 3) {
            console.log("name failed");
        } else if (phone.trim().length < 9) {
            console.log("phone failed");
        } else if (email.trim() == "") {
            console.log("email failed");
        } else if (email != reemail) {
            console.log("email reemail failed");
        } else if (password.trim().length < 7) {
            console.log("password failed");
        } else {
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    var user = userCredential.user;

                    firebase.database().ref('users/' + user.uid).set({
                        name: name,
                        phone: phone
                    });
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorMessage);
                });
        }
    });

    $("#user-logout").click(function (e) {
        e.preventDefault();
        firebase
            .auth()
            .signOut()
            .then(() => {})
            .catch((error) => {
                console.log(error.message);
            });
    });
});
