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

});
$("#nameSubmitTwo").on("click", function (event) {
    event.preventDefault();
    userName = $("#screenNameTwo").val().trim();
    player2.set({
        "secondPlayer": userName
    });
    $("#namePickTwo").hide();
    $("#namePickOne").hide();
})

player1.child("firstPlayer").on("value", function (snapshot) {
    $("#playerOne").text(snapshot.val());
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

player2.child("secondPlayer").on("value", function (snapshot) {
    $("#playerTwo").text(snapshot.val());
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
    $("#choicesOne").hide();
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
    $("#choicesTwo").hide();
    $("#battleChoiceTwo").text(b);
    throwPick.set({
        "throws": picks
    });

});

var pickNum;
// access the throwPick database 
throwPick.child("throws").on("value", function (snapshot) {
    pickNum = parseInt(snapshot.val())
    console.log(pickNum)
    // if statement that will set the players choices to the rpsChoice database
    if (pickNum === 2) {
        rpsChoice.set({
            "choice1": a,
            "choice2": b
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
                playerOneWin();
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
        }


    }
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// message submit pushes message and locally stored username to the chatroom database
$("#messageSubmit").on("click", function () {
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
    picks = snapshot.val().throws;
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

playerOneResults.on("value", function (snapshot) {
    playerOneWins = snapshot.val().wins;
    playerOneLosses = snapshot.val().losses;
    $("#wins").text(playerOneWins);
    $("#losses").text(playerOneLosses);
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

playerTwoResults.on("value", function (snapshot) {
    playerTwoWins = snapshot.val().wins;
    playerTwoLosses = snapshot.val().losses;
    $("#winsTwo").text(playerTwoWins);
    $("#lossesTwo").text(playerTwoLosses);
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// function for reseting the values that require reseting so the players can play rock paper scissors again 
function resetGame() {
    throwPick.set({
        "throws": 0
    });
    $("#choicesOne").show();
    $("#battleChoiceOne").text('');
    $("#choicesTwo").show();
    $("#battleChoiceTwo").text('');
}