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

// database listener for values and player status

database.ref("/players/").on("value", function(snapshot){

  event.preventDefault();
  // if statement too see assign player one/two status too user
  if(snapshot.child("playerOne").exists()){
    playerOne = snapshot.val().playerOne;
    $("#player1-name").text(playerOne.name);
  }
  else {

  }

if(snapshot.child("playerTwo").exists()){
  playerTwo = snapshot.val().playerTwo;
  $("#player2-name").text(playerTwo.name);
 
}
else {

}
if(snapshot.child("playerOne").exists() && snapshot.child("playerTwo").exists()){

    if (playerOne.choice === "blank" && playerTwo.choice === "blank") {

    $("#game-state").text("Player One's turn!");

    }
    else if (playerOne.choice != "blank" && playerTwo.choice === "blank") {
    $("game-state").text("Player Two's turn!")
    }
  }

});

// create listener for button values store them into firebase

$("#name-button").on("click", function(){

  event.preventDefault();

// store the player name in variable
  var playerName = $("#name-input").val().trim();
// if statement to see which player you are
if(playerOne === "false"){
  playerOne = {
    name: playerName,
    wins: 0,
    losses: 0,
    choice: "blank"
  };
  alert("you are Player One");
  database.ref().child("/players/playerOne").set(playerOne);
}
else if(playerTwo === "false"){
  playerTwo = {
    name: playerName,
    wins: 0,
    losses: 0,
    choice: "blank"
  };
  alert("you are Player Two");
  database.ref().child("/players/playerTwo").set(playerTwo);
}
else {
  
}
console.log(playerName);

  return false;
})

$(".rps-selector").on("click", function(button){

  event.preventDefault();

  if (playerOne != "false" && playerTwo != "false"){

    if (playerOne.choice === "" && playerTwo.choice === "") {
      $("#game-state-header").html("Player One's turn!");
      console.log("player one turn");
      playerOne.choice = $(this).attr("data-choice")
      database.ref().child("/players/playerOne.choice").set(playerOne.choice);
      console.log(playerOne.choice)
    }
    else if (playerOne.choice != "" && playerTwo.choice === "") {
      $("game-state-header").text("Player Two's turn!");
      console.log("player two turn");
      playerTwo.choice = $(this).attr("data-choice")
      database.ref().child("/players/playerTwo.choice").set(playerTwo.choice);
    }
  }
  else {
    $("#game-state-header").text("Waiting for Players")
    console.log("player does not exist")
  }
  console.log(playerOne);
  console.log(playerTwo);
})



