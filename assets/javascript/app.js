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
var playerTurn = 1;
var playerName
// database listener for values and player status
database.ref("/players/").on("value", function(snapshot){
  
  event.preventDefault();

  if (snapshot.child("playerOne").exists()) {
    
    playerOne = snapshot.val().playerOne;
    $("#player1-name").text(playerOne.name);
    $("#p1-wins").text("Wins: " + playerOne.win);
    $("#p1-losses").text("Losses: " + playerOne.loss);
  }
  else {
    console.log("no players")
  }
  if (snapshot.child("playerTwo").exists()) {

    playerTwo = snapshot.val().playerTwo;
    $("#player2-name").text(playerTwo.name);
    $("#p2-wins").text("Wins: " + playerTwo.win);
    $("#p2-losses").text("Losses: "+ playerTwo.loss)
  }
  else {
    console.log("player two does not exist")
  }
});

// Database listener for player disconnections 


// chat message database listener 


// listens for each turn
database.ref("/turn/").on("value", function (snapshot) {
  // Check if it's player1's turn
  if (snapshot.val() === 1) {
    console.log("TURN 1");
    playerTurn = 1;

    $("#game-state-header").html("Waiting on " + playerOne.name + " to choose!");

  } else if (snapshot.val() === 2) {
    console.log("TURN 2");
    playerTurn = 2;

    $("#game-state-header").html("Waiting on " + playerTwo.name + " to choose!");

  }
  else if (snapshot.val() === 3) {
    console.log("turn 3");
    playerTurn = 3

    $("#game-state-header").html("The Winner is")
  }
});
// listener for game outcome
database.ref("/outcome/").on("value", function (snapshot) {
  $("#game-state-header").text(snapshot.val());
});

// create listener for button values store them into firebase

$("#name-button").on("click", function () {
  playerConstructor();
});

$(".rps-selector").on("click", function(){

  if (playerOne && playerTwo && (playerName === playerOne.name) && (playerTurn === 1)) {

    playerOne.choice = $(this).val();
    database.ref().child("/players/playerOne/choice").set(playerOne.choice);
    console.log(playerOne.choice);
    playerTurn = 2;
    database.ref().child("/turn").set(2);

  }
  else if (playerOne && playerTwo && (playerName === playerTwo.name) && (playerTurn === 2)) {

    playerTwo.choice = $(this).val();
    database.ref().child("/players/playerTwo/choice").set(playerTwo.choice);
    console.log(playerTwo.choice);
    playerTurn = 3;
    database.ref().child("/turn").set(3);
  }

  if (playerTurn === 3){

    choiceCompare();

  }

});

$("#reset").on("click", function(){
  Reset();
})


// FUNCTIONS!!!!
function playerConstructor(){

  playerName = $("#name-input").val().trim();
  // if statement to see which player you are
  if (playerOne === "false") {
    playerOne = {
      name: playerName,
      win: 0,
      loss: 0,
      tie: 0,
      choice: "blank"
    };
    alert("you are Player One");
    database.ref().child("/players/playerOne").set(playerOne);
    database.ref().child("/turn").set(1);
    database.ref("/players/playerOne").onDisconnect().remove();
  }
  else {
    playerTwo = {
      name: playerName,
      win: 0,
      loss: 0,
      tie: 0,
      choice: "blank"
    };
    alert("you are Player Two");
    database.ref().child("/players/playerTwo").set(playerTwo);
    database.ref("/players/playerTwo").onDisconnect().remove();
  }
  console.log(playerName);
  console.log(playerOne);
  console.log(playerTwo);
}
function choiceCompare() {
	if (playerOne.choice === "Rock") {
		if (playerTwo.choice === "Rock") {
			// Tie
			console.log("tie");

			database.ref().child("/outcome/").set("Tie game!");
			database.ref().child("/players/playerOne/tie").set(playerOne.tie + 1);
      database.ref().child("/players/playerTwo/tie").set(playerTwo.tie + 1);
      $("#player1-selected").text("You chose Rock");
      $("#player2-selected").text("You chose Rock");
		} else if (playerTwo.choice === "Paper") {
			// PlayerTwo wins
			console.log("paper wins");

			database.ref().child("/outcome/").set( playerTwo.name + " wins!");
			database.ref().child("/players/playerOne/loss").set(playerOne.loss + 1);
      database.ref().child("/players/playerTwo/win").set(playerTwo.win + 1);
      $("#player1-selected").text("You chose Rock");
      $("#player2-selected").text("You chose Paper");
    } else { // scissors
			// PlayerOne wins
			console.log("rock wins");

			database.ref().child("/outcome/").set(playerOne.name + " wins!");
			database.ref().child("/players/playerOne/win").set(playerOne.win + 1);
      database.ref().child("/players/playerTwo/loss").set(playerTwo.loss + 1);
      $("#player1-selected").text("You chose Rock");
      $("#player2-selected").text("You chose Scissors");
		}

	} else if (playerOne.choice === "Paper") {
		if (playerTwo.choice === "Rock") {
			// PlayerOne wins
			console.log("paper wins");

			database.ref().child("/outcome/").set(playerOne.name + " wins!");
			database.ref().child("/players/playerOne/win").set(playerOne.win + 1);
      database.ref().child("/players/playerTwo/loss").set(playerTwo.loss + 1);
      $("#player1-selected").text("You chose Paper");
      $("#player2-selected").text("You chose Rock");
		} else if (playerTwo.choice === "Paper") {
			// Tie
			console.log("tie");

			database.ref().child("/outcome/").set("Tie game!");
			database.ref().child("/players/playerOne/tie").set(playerOne.tie + 1);
      database.ref().child("/players/playerTwo/tie").set(playerTwo.tie + 1);
      $("#player1-selected").text("You chose Paper");
      $("#player2-selected").text("You chose Paper");
		} else { // Scissors
			// PlayerTwo wins
			console.log("scissors win");

			database.ref().child("/outcome/").set(playerTwo.name + " wins!");
			database.ref().child("/players/playerOne/loss").set(playerOne.loss + 1);
      database.ref().child("/players/playerTwo/win").set(playerTwo.win + 1);
      $("#player1-selected").text("You chose Paper");
      $("#player2-selected").text("You chose Scissors");
		}

	} else if (playerOne.choice === "Scissors") {
		if (playerTwo.choice === "Rock") {
			// PlayerTwo wins
			console.log("rock wins");

			database.ref().child("/outcome/").set(playerTwo.name + " wins!");
			database.ref().child("/players/playerOne/loss").set(playerOne.loss + 1);
      database.ref().child("/players/playerTwo/win").set(playerTwo.win + 1);
      $("#player1-selected").text("You chose Scissors!");
      $("#player2-selected").text("You chose Rock");
		} else if (playerTwo.choice === "Paper") {
			// PlayerOne wins
			console.log("scissors win");

			database.ref().child("/outcome/").set(playerOne.name + " wins!");
			database.ref().child("/players/playerOne/win").set(playerOne.win + 1);
      database.ref().child("/players/playerTwo/loss").set(playerTwo.loss + 1);
      $("#player1-selected").text("You chose Scissors");
      $("#player2-selected").text("You chose Paper");
		} else {
			// Tie
			console.log("tie");

			database.ref().child("/outcome/").set("Tie game!");
			database.ref().child("/players/playerOne/tie").set(playerOne.tie + 1);
      database.ref().child("/players/playerTwo/tie").set(playerTwo.tie + 1);
      $("player1-selected").text("You chose Scissors");
      $("player2-selected").text("You chose Scissors");
      $("#game-state-header").text("Tie Game!")
		}

  }
}

function Reset() {
  database.ref().child("/players/playerOne/choice").set("blank");
  database.ref().child("/players/playerTwo/choice").set("blank");
  playerTurn = 1;
	database.ref().child("/turn").set(1);
}
