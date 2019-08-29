var origBoard;
const huPlayer = 'X';
const aiPlayer = 'O';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const squares = document.querySelectorAll('.square');
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	document.querySelector("button").style.display = "none";
	document.querySelector("h3").style.display = "block";
	document.querySelector(".who").innerText = "Click to begin";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < squares.length; i++) {
		squares[i].innerText = '';
		squares[i].style.removeProperty('background-color');
		squares[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	document.querySelector("h3").style.display = "none";
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer);
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	if(player == "O") {
		setTimeout(function(){
			document.getElementById(squareId).innerText = player;
		  }, 500);
	} else if(player == "X") {
		document.getElementById(squareId).innerText = player;
	}
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor = 
			gameWon.player == huPlayer ? "green" : "red";
	}
	for (var i = 0; i < squares.length; i++) {
		squares[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
	document.querySelector(".who").innerText = "Click to begin";
}

function declareWinner(who) {
	setTimeout(function(){
		document.querySelector(".endgame").style.display = "block";
		document.querySelector("button").style.display = "block";
		document.querySelector(".endgame .text").innerText = who;
		if(who == "You lose.") {
			document.querySelector(".endgame").style.backgroundColor = "rgb(226, 0, 0, .8)";
		} else if(who == "Tie Game!") {
			// document.querySelector(".endgame").style.backgroundColor = "rgb(0, 151, 60, .8)";
			document.querySelector(".endgame").style.backgroundColor = "rgb(0, 128, 0, .8)";
		} 
	  }, 200);
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < squares.length; i++) {
			squares[i].style.backgroundColor = "#006441";
			squares[i].removeEventListener('click', turnClick, false);
		}
		
		declareWinner("Tie Game!");
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}