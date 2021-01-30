"use strict";

$(function () {

    $("#login-form").submit(function (e) {
        e.preventDefault();
        var email = $("#login-email").val();
        var password = $("#login-password").val();

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                var user = userCredential.user;
                $("#login-form-modal").hide();
                $("#user-data").text(name);
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
                    $("#register-form-modal").hide();
                    $("#user-data").text(name);
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorMessage);
                });
        }
    });

    // $("#logout-button").click(function (e) {
    $(document).on('click', '#logout-button', function(e){
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
