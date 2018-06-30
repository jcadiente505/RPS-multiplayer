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

database.ref("/players/").on("value", function (snapshot) {

  event.preventDefault();
  // if statement too see assign player one/two status too user
  if (snapshot.child("playerOne").exists()) {

    playerOne = snapshot.val().playerOne;
    $("#player1-name").text(playerOne.name);
    $("#game-state-header").text("Waiting for Player Two")

  }
  else {

    $("#game-state-header").html("Waiting for Player One")
    console.log("player one does not exist")

  }

  if (snapshot.child("playerTwo").exists()) {

    playerTwo = snapshot.val().playerTwo;
    $("#player2-name").text(playerTwo.name);

  }

  if (snapshot.child("playerOne").exists() && snapshot.child("playerTwo").exists()) {

    $("#game-state-header").text("Waiting for " + playerOne.name + " to choose!")

  }

});

// Database listener for player disconnections 
database.ref("/players/").on("child_removed", function (snapshot) {

  var msg = snapshot.val().name + " has disconnected!";

  // Get a key for the disconnection chat entry
  var chatKey = database.ref().child("/chat/").push().key;

  // Save the disconnection chat entry
  database.ref("/chat/" + chatKey).set(msg);

});

// chat message database listener 
database.ref("/chat/").on("child_added", function (snapshot) {

  var chatMsg = snapshot.val();

  $("#chatlog").append(chatMsg);
  $("#chatlog").scrollTop($("#chatlog")[0].scrollHeight);

});

// listens for each turn 
database.ref("/turn/").on("value", function (snapshot) {
  // Check if it's player1's turn
  if (snapshot.val() === 1) {
    console.log("TURN 1");
    playerTurn = 1;

    // Update the display if both players are in the game
    if (playerOne.choice && playerTwo.choice) {

      $("#game-state-header").html("Waiting on " + playerOne.name + " to choose!");

    }
  } else if (snapshot.val() === 2) {
    console.log("TURN 2");
    playerTurn = 2;

    // Update the display if both players are in the game
    if (playerOne.choice && playerTwo.choice) {

      $("#game-state-header").html("Waiting on " + playerTwo.name + " to choose!");

    }
  }
});

// listener for game outcome
database.ref("/outcome/").on("value", function (snapshot) {
  $("#game-state-header").text(snapshot.val());
});
// create listener for button values store them into firebase

$("#name-button").on("click", function () {

  event.preventDefault();

  // store the player name in variable
  playerName = $("#name-input").val().trim();
  // if statement to see which player you are
  if (playerOne === "false") {
    playerOne = {
      name: playerName,
      win: 0,
      loss: 0,
      choice: "blank"
    };
    alert("you are Player One");
    database.ref().child("/players/playerOne").set(playerOne);
    database.ref().child("/turn").set(1);
    database.ref("/players/playerOne").onDisconnect().remove();
  }
  else if ((playerOne != "false") && (playerTwo === "false")) {
    playerTwo = {
      name: playerName,
      win: 0,
      loss: 0,
      choice: "blank"
    };
    alert("you are Player Two");
    database.ref().child("/players/playerTwo").set(playerTwo);
    database.ref("/players/playerTwo").onDisconnect().remove();
  }
  console.log(playerName);
  // Add a user joining message to the chat
  var msg = playerName + " has joined!";
  console.log(msg);

  // Get a key for the join chat entry
  var chatKey = database.ref().child("/chat/").push().key;

  // Save the join chat entry
  database.ref("/chat/" + chatKey).set(msg);

  // Reset the name input box
  $("#name-input").val("");

  return false;
});

$(".rps-selector").on("click", function (button) {

  event.preventDefault();

  // make sure both people are in the game
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
    console.log(playerTwo.choice)
    choiceCompare();

  }


  

});

$("#message").on("click", function (event) {

  event.preventDefault();

  // First, make sure that the player exists and the message box is not empty
  if ((playerName !== "") && ($("#message").val().trim() !== "")) {
    // Grab the message from the input box and subsequently reset the input box
    var msg = PlayerName + ": " + $("#message").val().trim();
    $("#message").val("");

    // Get a key for the new chat entry
    var chatKey = database.ref().child("/chat/").push().key;

    // Save the new chat entry
    database.ref("/chat/" + chatKey).set(msg);
  }
});

function choiceCompare() {
	if (playerOne.choice === "Rock") {
		if (playerTwo.choice === "Rock") {
			// Tie
			console.log("tie");

			database.ref().child("/outcome/").set("Tie game!");
			database.ref().child("/players/playerOne/tie").set(playerOne.tie + 1);
      database.ref().child("/players/playerTwo/tie").set(playerTwo.tie + 1);
      database.ref().child("/players/playerOne/choice").set("blank")
      database.ref().child("/players/playerTwo/choice").set("blank");
		} else if (playerTwo.choice === "Paper") {
			// PlayerTwo wins
			console.log("paper wins");

			database.ref().child("/outcome/").set("Paper wins!");
			database.ref().child("/players/playerOne/loss").set(playerOne.loss + 1);
			database.ref().child("/players/playerTwo/win").set(playerTwo.win + 1);
      database.ref().child("/players/playerOne/choice").set("blank");
      database.ref().child("/players/playerTwo/choice").set("blank");
    } else { // scissors
			// PlayerOne wins
			console.log("rock wins");

			database.ref().child("/outcome/").set("Rock wins!");
			database.ref().child("/players/playerOne/win").set(playerOne.win + 1);
      database.ref().child("/players/playerTwo/loss").set(playerTwo.loss + 1);
      database.ref().child("/players/playerOne/choice").set("blank");
      database.ref().child("/players/playerTwo/choice").set("blank");
		}

	} else if (playerOne.choice === "Paper") {
		if (playerTwo.choice === "Rock") {
			// PlayerOne wins
			console.log("paper wins");

			database.ref().child("/outcome/").set("Paper wins!");
			database.ref().child("/players/playerOne/win").set(playerOne.win + 1);
      database.ref().child("/players/playerTwo/loss").set(playerTwo.loss + 1);
      database.ref().child("/players/playerOne/choice").set("blank");
      database.ref().child("/players/playerTwo/choice").set("blank");
		} else if (playerTwo.choice === "Paper") {
			// Tie
			console.log("tie");

			database.ref().child("/outcome/").set("Tie game!");
			database.ref().child("/players/playerOne/tie").set(playerOne.tie + 1);
      database.ref().child("/players/playerTwo/tie").set(playerTwo.tie + 1);
      database.ref().child("/players/playerOne/choice").set("blank");
      database.ref().child("/players/playerTwo/choice").set("blank");
		} else { // Scissors
			// PlayerTwo wins
			console.log("scissors win");

			database.ref().child("/outcome/").set("Scissors win!");
			database.ref().child("/players/playerOne/loss").set(playerOne.loss + 1);
      database.ref().child("/players/playerTwo/win").set(playerTwo.win + 1);
      database.ref().child("/players/playerOne/choice").set("blank");
      database.ref().child("/players/playerTwo/choice").set("blank");
		}

	} else if (playerOne.choice === "Scissors") {
		if (playerTwo.choice === "Rock") {
			// PlayerTwo wins
			console.log("rock wins");

			database.ref().child("/outcome/").set("Rock wins!");
			database.ref().child("/players/playerOne/loss").set(playerOne.loss + 1);
      database.ref().child("/players/playerTwo/win").set(playerTwo.win + 1);
      database.ref().child("/players/playerOne/choice").set("blank");
      database.ref().child("/players/playerTwo/choice").set("blank");
		} else if (playerTwo.choice === "Paper") {
			// PlayerOne wins
			console.log("scissors win");

			database.ref().child("/outcome/").set("Scissors win!");
			database.ref().child("/players/playerOne/win").set(playerOne.win + 1);
      database.ref().child("/players/playerTwo/loss").set(playerTwo.loss + 1);
      database.ref().child("/players/playerOne/choice").set("blank");
      database.ref().child("/players/playerTwo/choice").set("blank");
		} else {
			// Tie
			console.log("tie");

			database.ref().child("/outcome/").set("Tie game!");
			database.ref().child("/players/playerOne/tie").set(playerOne.tie + 1);
      database.ref().child("/players/playerTwo/tie").set(playerTwo.tie + 1);
      database.ref().child("/players/playerOne/choice").set("blank");
      database.ref().child("/players/playerTwo/choice").set("blank");
		}

  }
  playerTurn = 1;
	database.ref().child("/turn").set(1);
}
