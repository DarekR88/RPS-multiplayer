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

// on page load the player areas and message input will be hidden 
$(document).ready(function () {
    $("#playerAreaOne").hide();
    $("#playerAreaTwo").hide();
    $("#messageAreaOne").hide();
    $("#messageAreaTwo").hide();
});

// variable that will hold the number of players 
var players = 0;

// reference database on value change and get a snapshot and concole log snap shot  
database.ref().on("value", function (snapshot) {
    console.log(snapshot.val());
    // set the number of players in the playerCount to a variable
    players = snapshot.val().playerCount;
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
})

// on click function that will add players to the game 
$("#nameSubmit").on("click", function (event) {
    event.preventDefault();

    players++;
    // create and update playercount in database
    database.ref().set({
        playerCount: players
    });

});


var a;
var b;

// capture the choice of player one on submit click
$("#playerOneChoice").click(function (event) {
    event.preventDefault();
    a = $("#choiceOne").val();
    console.log(a);
    $("#choicesOne").hide();
    $("#battleChoiceOne").text(a);
});

// capture the choice of player two on submit click
$("#playerTwoChoice").click(function (event) {
    event.preventDefault();
    b = $("#choiceTwo").val();
    console.log(b);
    $("#choicesTwo").hide();
    $("#battleChoiceTwo").text(b);
});

