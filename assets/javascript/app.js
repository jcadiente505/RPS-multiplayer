// initialize firebase
var config = {
    apiKey: "AIzaSyD7uldkxKIeqbnQS_8mnIfSbr6WYxbc8pE",
    authDomain: "rps-multiplayer-138d6.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-138d6.firebaseio.com",
    projectId: "rps-multiplayer-138d6",
    storageBucket: "rps-multiplayer-138d6.appspot.com",
    messagingSenderId: "163949376502"
  };
  firebase.initializeApp(config);

// database variable
var database = firebase.database();
var playerNum = 2;
var playerOne = "false";
var playerTwo = "false";
var winCounter = 0;
var loseCounter = 0;
var chatMsg = "";
var playerTurn = 0;

// grab the input values of user interface
$("#name-input").val().trim()
// set the player one info in firebase

