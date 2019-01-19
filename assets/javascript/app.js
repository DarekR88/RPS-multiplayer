var config = {
    apiKey: "AIzaSyCwWP657BbN7yYtf689qJYiHFQ_fScA-lg",
    authDomain: "rock-paper-scissors-game-14092.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-game-14092.firebaseio.com",
    projectId: "rock-paper-scissors-game-14092",
    storageBucket: "rock-paper-scissors-game-14092.appspot.com",
    messagingSenderId: "407664310605"
};

firebase.initializeApp(config);

var database = firebase.database();

// create a variable for branch database of players 
var player1 = database.ref("/player1")
var player2 = database.ref("/player2")

// database for the chatroom
var chatBase = database.ref("/chatroom")

// databases for the rps choices 
var rpsChoice = database.ref("/choices")


// database branch for connections and connection info
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

// add and remove users based on connection
connectedRef.on("value", function (snap) {
    if (snap.val()) {
        var con = connectionsRef.push(true);
        con.onDisconnect().remove();
    }
});

// username variable
var userName;

// on ready show the sn submit area
$(document).ready(function () {
    $("#namePick").show();
})

// on submit of namesubmit capture the username in a variable 
$("#nameSubmit").on("click", function (event) {
    event.preventDefault();
    userName = $("#screenName").val().trim();
    localStorage.setItem("name", userName);
    player1.on("value", function (snapshot) {
        if (snapshot.child("firstPlayer").exists()) {
            player2.set({
                "secondPlayer": userName
            })
            $("#namePick").hide();
        } else {
            player1.set({
                "firstPlayer": userName
            });
        };
    });
});

player1.child("firstPlayer").on("value", function (snapshot) {
    $("#playerOne").text(snapshot.val());
});

player2.child("secondPlayer").on("value", function (snapshot) {
    $("#playerTwo").text(snapshot.val());
});

var a;
var b;

// capture the choice of player one on submit click
$("#playerOneChoice").click(function (event) {
    event.preventDefault();
    a = $("#choiceOne").val();
    $("#choicesOne").hide();
    $("#battleChoiceOne").text(a);
    rpsChoice.push({
        "choice1": a
    })

});

// capture the choice of player two on submit click
$("#playerTwoChoice").click(function (event) {
    event.preventDefault();
    b = $("#choiceTwo").val();
    $("#choicesTwo").hide();
    $("#battleChoiceTwo").text(b);
    rpsChoice.push({
        "choice2": b
    })
});

// snapshot the rpsChoice database branch if both choices have been made run a switch case function to get the results 
rpsChoice.on("value", function (snapshot) {
    if (snapshot.child("choice1").exists() && snapshot.child("choice2").exists()) {

        var playerOneChoice = snapshot.val().choice1;
        var playerTwoChoice = snapshot.val().choice2;
        switch (playerOneChoice + playerTwoChoice) {
            case "rockrock":
                $("#results").text("Tie Game")
                $("#resultsImage").html("<img src='assets/images/rocktie.jpg'>")
                break;
            case "rockscissors":
                $("#results").text("Player One Wins!")
                $("#resultsImage").html("<img src'assets/images/rockwin.jpg'>")
                break;
            case "rockpaper":
                $("#results").text("Player Two Wins")
                $("#resultsImage").html("<img src'assets/images/paperwin.jpg'>")
                break;
            case "paperpaper":
                $("#results").text("Tie Game")
                $("#resultsImage").html("<img src'assets/images/papertie.jpg'>")
                break;
            case "paperscissors":
                $("#results").text("Player Two Wins!")
                $("#resultsImage").html("<img src'assets/images/scissorswin.jpg'>")
                break;
            case "paperrock":
                $("#results").text("Player One Wins!")
                $("#resultsImage").html("<img src'assets/images/paperwin.jpg'>")
                break;
            case "scissorsscissors":
                $("#results").text("Tie Game")
                $("#resultsImage").html("<img src'assets/images/scissorstie.jpg'>")
                break;
            case "scissorspaper":
                $("#results").text("Player One Wins")
                $("#resultsImage").html("<img src'assets/images/scissorswin.jpg'>")
                break;
            case "scissorsrock":
                $("#results").text("Player Two Wins")
                $("#resultsImage").html("<img src'assets/images/rockwin.jpg'>")
                break;
            default:
                $("#results").text("")
                $("#resultsImage").html("")
        }


    }

});

// message submit pushes message and locally stored username to the chatroom database
$("#messageSubmit").on("click", function () {
    var screenName = localStorage.getItem("name");
    var message = $("#message").val().trim();
    chatBase.push({
        "name": screenName,
        "message": message
    });
    $("#message").val('');
})

// when things are added to the chatroom database the username and message are appended to the html
chatBase.on("child_added", function (snapshot) {
    var name = snapshot.val().name
    var message = snapshot.val().message
    $("#messages").append(name + ": " + message + "<br>")
})





