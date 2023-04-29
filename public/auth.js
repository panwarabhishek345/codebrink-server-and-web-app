"use strict"

// Initialize Firebase
var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function (user) {

    if (user) {

        let url = "/author/Dashboard";
        let page = "my-articles"
        if (localStorage.getItem("role") == "admin") {
            url = "/admin/Dashboard";
            page = "pending-articles";
        }

        user.getIdToken(false).then(function (IDToken) {
            $.ajax({
                type: "GET",
                beforeSend: function (request) {
                    request.setRequestHeader("IDToken", IDToken);
                    request.setRequestHeader("page", page);
                },
                url: url,
                data: "",
                processData: false,
                success: function (data, textStatus) {
                    document.getElementById("progress-spinner").style.display = "none";
                    var w = window.open("", "_self");
                    w.document.write(data);
                    w.document.close();
                },
                error: function (response, exception) {
                    console.log(response);
                    $('#home-container').html(response.responseText);
                    showLoader(false);
                },
            });
        });


    } else {
        showLoader(false);
    }
});

function login(role) {
    document.getElementById("progress-spinner").style.display = "block";
    localStorage.setItem("role", role);
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: 'select_account'
    });
    firebase.auth().signInWithPopup(provider).then(function (result) {
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + ": " + errorMessage);
        showLoader(false);
    });
}


function logout() {
    firebase.auth().signOut().then(function () {
        window.location.href = "/";
        showLoader(false);
    }, function (error) {
        window.location.href = "/";
    });
}

function showLoader(show) {
    var home_container = document.getElementById("home-container");
    var progress_spinner = document.getElementById("progress-spinner");

    if(home_container && progress_spinner)
    if (show) {
        home_container.style.display = "none";
        progress_spinner.style.display = "block";
    } else {
        home_container.style.display = "block";
        progress_spinner.style.display = "none";
    }
}

$(document).ready( function() {
    $("#tour-btn").click(function() {
        $('html, body').animate({
            scrollTop: $("#mission-section").offset().top
        }, 1000);
    });
});