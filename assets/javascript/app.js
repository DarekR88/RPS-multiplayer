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

// firebase branches for wins and losses for each player
var playerOneResults = database.ref("/player1wl");
var playerTwoResults = database.ref("/player2wl");

// create a variable for branch database of players 
var player1 = database.ref("/player1");
var player2 = database.ref("/player2");

// databases for storing the player's choices at first 
var player1choice = database.ref("/firstPlayerChoice");
var player2choice = database.ref("/secondPlayerChoice");

// database for the chatroom
var chatBase = database.ref("/chatroom");

// databases for the rps choices for the results 
var rpsChoice = database.ref("/choices");

// database for holding the number of choices made
var throwPick = database.ref("/choicesMade");

// player's wins and losses variable
var playerOneWins = 0;
var playerOneLosses = 0;
var playerTwoWins = 0;
var playerTwoLosses = 0;

// on ready function for hiding the player choice areas 
$(document).ready(function () {
    $("#choicesOne").hide();
    $("#choicesTwo").hide();
    $("#leaveOne").hide();
    $("#leaveTwo").hide();
    $("#messageArea").hide();
});

// username variable
var userName;

// on submit of namesubmit capture the username in a variable 
$("#nameSubmitOne").on("click", function (event) {
    event.preventDefault();
    userName = $("#screenNameOne").val().trim();
    player1.set({
        "firstPlayer": userName
    });
    $("#namePickOne").hide();
    $("#namePickTwo").hide();
    $("#choicesOne").show();
    $("#leaveOne").show();
    $("#messageArea").show();
    $("#screenNameOne").val('');
});
$("#nameSubmitTwo").on("click", function (event) {
    event.preventDefault();
    userName = $("#screenNameTwo").val().trim();
    player2.set({
        "secondPlayer": userName
    });
    $("#namePickTwo").hide();
    $("#namePickOne").hide();
    $("#choicesTwo").show();
    $("#leaveTwo").show();
    $("#messageArea").show();
    $("#screenNameTwo").val('');
});

player1.on("value", function (snapshot) {
    if (snapshot.child("firstPlayer").exists()) {
        $("#namePickOne").hide();
        $("#playerOne").text(snapshot.val().firstPlayer);
    }
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

player2.on("value", function (snapshot) {
    if (snapshot.child("secondPlayer").exists()) {
        $("#namePickTwo").hide();
        $("#playerTwo").text(snapshot.val().secondPlayer);
    }
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// variables to hold the player's choicds 
var a;
var b;

// variable for holding the number of picks
var picks = 0;

// capture the choice of player one on submit click
$("#playerOneChoice").click(function (event) {
    event.preventDefault();
    picks++;
    a = $("#choiceOne").val();
    player1choice.set({
        "choice": a
    });
    $("#battleChoiceOne").text(a);

    throwPick.set({
        "throws": picks
    });
});


// capture the choice of player two on submit click
$("#playerTwoChoice").click(function (event) {
    event.preventDefault();
    picks++;
    b = $("#choiceTwo").val();
    player2choice.set({
        "choice": b
    })
    $("#battleChoiceTwo").text(b);
    throwPick.set({
        "throws": picks
    });

});

// set variables to the choices in the player choices databases
var choiceA;
var choiceB;

player1choice.on("value", function (snapshot) {
    if (snapshot.child("choice").exists()) {
        choiceA = snapshot.val().choice;
    }
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});
player2choice.on("value", function (snapshot) {
    if (snapshot.child("choice").exists()) {
        choiceB = snapshot.val().choice;
    }
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

var pickNum;
// access the throwPick database 
throwPick.child("throws").on("value", function (snapshot) {
    pickNum = parseInt(snapshot.val());
    // if statement that will set the players choices to the rpsChoice database
    if (pickNum === 2) {
        rpsChoice.set({
            "choice1": choiceA,
            "choice2": choiceB
        });
    };
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
})


// snapshot the rpsChoice database branch if both choices have been made run a switch case function to get the results 
rpsChoice.on("value", function (snapshot) {
    if (snapshot.child("choice1").exists() && snapshot.child("choice2").exists()) {
        var playerOneChoice = snapshot.val().choice1;
        var playerTwoChoice = snapshot.val().choice2;
        console.log(playerOneChoice + playerTwoChoice);

        switch (playerOneChoice + playerTwoChoice) {
            case "rockrock":
                $("#results").text("Tie Game");
                $("#resultsImage").html("<img src='assets/images/rocktie.jpg'>");
                resetGame();
                break;
            case "rockscissors":
                $("#results").text("Player One Wins!");
                $("#resultsImage").html("<img src='assets/images/rockwin.jpg'>");
                playerOnewin();
                resetGame();
                break;
            case "rockpaper":
                $("#results").text("Player Two Wins");
                $("#resultsImage").html("<img src='assets/images/paperwin.jpg'>");
                playerTwowin();
                resetGame();
                break;
            case "paperpaper":
                $("#results").text("Tie Game");
                $("#resultsImage").html("<img src='assets/images/papertie.jpg'>");
                resetGame();
                break;
            case "paperscissors":
                $("#results").text("Player Two Wins!")
                $("#resultsImage").html("<img src='assets/images/scissorwin.jpg'>")
                playerTwowin();
                resetGame();
                break;
            case "paperrock":
                $("#results").text("Player One Wins!");
                $("#resultsImage").html("<img src='assets/images/paperwin.jpg'>");
                playerOnewin();
                resetGame();
                break;
            case "scissorsscissors":
                $("#results").text("Tie Game");
                $("#resultsImage").html("<img src='assets/images/scissorstie.jpg'>");
                resetGame();
                break;
            case "scissorspaper":
                $("#results").text("Player One Wins");
                $("#resultsImage").html("<img src='assets/images/scissorwin.jpg'>");
                playerOnewin();
                resetGame();
                break;
            case "scissorsrock":
                $("#results").text("Player Two Wins");
                $("#resultsImage").html("<img src='assets/images/rockwin.jpg'>");
                playerTwowin();
                resetGame();
                break;
            default:
                $("#results").text("")
                $("#resultsImage").html("")
        };


    };
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// message submit pushes message and locally stored username to the chatroom database
$("#messageSubmit").on("click", function (event) {
    event.preventDefault();
    var message = $("#message").val().trim();
    chatBase.push({
        "name": userName,
        "message": message
    });
    $("#message").val('');
})

// when things are added to the chatroom database the username and message are appended to the html
chatBase.on("child_added", function (snapshot) {
    var name = snapshot.val().name
    var message = snapshot.val().message
    $("#messages").append(name + ": " + message + "<br>")
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

function playerOnewin() {
    playerOneWins++;
    playerTwoLosses++;
    playerOneResults.set({
        "wins": playerOneWins,
        "losses": playerOneLosses
    });
    playerTwoResults.set({
        "wins": playerTwoWins,
        "losses": playerTwoLosses
    });
};

function playerTwowin() {
    playerTwoWins++;
    playerOneLosses++;
    playerTwoResults.set({
        "wins": playerTwoWins,
        "losses": playerTwoLosses
    });
    playerOneResults.set({
        "wins": playerOneWins,
        "losses": playerOneLosses
    });
};

// update variables based on the values stored in firebase when the values change
throwPick.on("value", function (snapshot) {
    if (snapshot.child("throws").exists()) {
        picks = snapshot.val().throws;
    }
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

playerOneResults.on("value", function (snapshot) {
    if (snapshot.child("wins").exists() && snapshot.child("losses").exists()) {
        playerOneWins = snapshot.val().wins;
        playerOneLosses = snapshot.val().losses;
        $("#wins").text(playerOneWins);
        $("#losses").text(playerOneLosses);
    }
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

playerTwoResults.on("value", function (snapshot) {
    if (snapshot.child("wins").exists() && snapshot.child("losses").exists()) {
        playerTwoWins = snapshot.val().wins;
        playerTwoLosses = snapshot.val().losses;
        $("#winsTwo").text(playerTwoWins);
        $("#lossesTwo").text(playerTwoLosses);
    }
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// function for reseting the values that require reseting so the players can play rock paper scissors again 
function resetGame() {
    throwPick.set({
        "throws": 0
    });
    $("#battleChoiceOne").text('');
    $("#battleChoiceTwo").text('');
};

// on click function for leaving the game and clearing the branches that need to be cleared and changing the html accordingly
$("#leaveOne").on("click", function () {
    player1.set({
        "firstPlayer": ""
    })
    player1.remove();
    $("#choicesOne").hide();
    $("#namePickOne").show();
    playerTwoWins = 0;
    playerOneWins = 0;
    playerOneLosses = 0;
    playerTwoLosses = 0;
    playerOneResults.set({
        "wins": playerOneWins,
        "losses": playerOneLosses
    });
    playerTwoResults.set({
        "wins": playerTwoWins,
        "losses": playerTwoLosses
    });
    player1choice.remove();
    $("#battleChoiceOne").text("");
    rpsChoice.remove();
    throwPick.set({
        "throws": 0
    });
    $("#leaveOne").hide();
});

$("#leaveTwo").on("click", function () {
    player2.set({
        "secondPlayer": ""
    });
    player2.remove();
    $("#choicesTwo").hide();
    $("#namePickTwo").show();
    playerTwoWins = 0;
    playerOneWins = 0;
    playerOneLosses = 0;
    playerTwoLosses = 0;
    playerOneResults.set({
        "wins": playerOneWins,
        "losses": playerOneLosses
    });
    playerTwoResults.set({
        "wins": playerTwoWins,
        "losses": playerTwoLosses
    });
    player2choice.remove();
    $("#battleChoiceTwo").text("")
    rpsChoice.remove();
    throwPick.set({
        "throws": 0
    });
    $("#leaveTwo").hide();
});