var canvas;

window.onload = function() {
	canvas = document.getElementById("game");
	
	var game = new SpaceInvadersGame(canvas);
	
	window.addEventListener('keydown', game.handleKeyDown);
	window.addEventListener('keyup', game.handleKeyUp);
	
	setInterval(game.update, 1000 / 60);
}