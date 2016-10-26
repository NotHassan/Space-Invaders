var SpaceInvadersGame = function() {
	var INVADERS_PER_COLUMN = 7;
	var INVADERS_PER_ROW = 5;
	var INVADER_MOVE_SPEED = 500;
	var INVADER_SPEED_BOOST1 = 350;
	var INVADER_SPEED_BOOST2 = 250;
	var INVADER_SHOOT_SPEED = 20;
	var LIVES = 3;
	
	var _this = this;
	var _ctx = canvas.getContext("2d");
	var _keys = new Array(256);
	var _ship = null;
	var _projectiles = [];
	var _invaders = [];
	var _blockades = [];
	var _gameMenu = true;
	var _gameWin = false;
	var _gameLose = false;
	
	var score, hitSide = false;
	
	this.handleKeyDown = function(e) {
		if(e.keyCode == 32)
			e.preventDefault();
		
		_keys[e.keyCode] = true;
	}
	
	this.handleKeyUp = function(e) {
		_keys[e.keyCode] = false;
	}
	
	this.startScreen = function() {
		score = 0;
		direction = 1;
		moveDown = false;
		_ship = new Ship();
		
		_ctx.fillStyle = "black";
		_ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		_ctx.font = "15px Ariel";
		_ctx.fillStyle = "white";
		_ctx.textAlign = "center";
		_ctx.fillText("Press Enter to start", canvas.width / 2, canvas.height / 2 - 10);
		_ctx.fillText("------", canvas.width / 2, canvas.height / 2);
		_ctx.font = "10px Ariel";
		_ctx.fillText("Move: Left/Right Arrow", canvas.width / 2, canvas.height / 2 + 10);
		_ctx.fillText("Fire: Space Bar", canvas.width / 2, canvas.height / 2 + 20);
		
		if(_keys[13]) {
			_gameMenu = false;
			_this.makeInvaders();
			_this.makeBlockades();
		}
	}
	
	this.winScreen = function() {
		_ctx.fillStyle = "black";
		_ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		_ctx.font = "15px Ariel";
		_ctx.fillStyle = "white";
		_ctx.textAlign = "center";
		_ctx.fillText("Congratulations, you win!", canvas.width / 2, canvas.height / 2 - 7.5);
		_ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 7.5);
		
		_ctx.font = "10px Ariel";
		_ctx.fillText("Press Enter to play again!", canvas.width / 2, canvas.height / 2 + 25);
		
		if(_keys[13]) {
			_gameWin = false;
			_this.start();
		}
	}
	
	this.loseScreen = function() {
		_ctx.fillStyle = "black";
		_ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		_ctx.font = "15px Ariel";
		_ctx.fillStyle = "white";
		_ctx.textAlign = "center";
		_ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 7.5);
		_ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 7.5);
		
		_ctx.font = "10px Ariel";
		_ctx.fillText("Press Enter to try again!", canvas.width / 2, canvas.height / 2 + 25);
		
		if(_keys[13]) {
			_gameLose = false;
			_this.start();
		}
	}
	
	this.start = function() {
		score = 0;
		direction = 1;
		LIVES = 3;
		INVADER_MOVE_SPEED = 500;
		_ship = new Ship();
		_projectiles = [];
		_this.makeInvaders();
		_this.makeBlockades();
	}
	
	this.update = function() {
		if(_gameMenu) {
			_this.startScreen();
		} else if(_gameWin) {
			_this.winScreen();
		} else if(_gameLose) {
			_this.loseScreen();
		} else {
			var elapsedTime = 1 / 60;
			
			_this.processInput(elapsedTime);
			_this.updateGameObjects(elapsedTime);
			_this.checkCollisions();
			_this.draw();
		}
	}
	
	this.makeInvaders = function() {
		_invaders = [];
		
		for(var i = 0; i < INVADERS_PER_COLUMN; i++) {
			for(var j = 0; j < INVADERS_PER_ROW; j++) {
				_invaders.push(new Invader((canvas.width / 2) + ((i - Math.floor(INVADERS_PER_COLUMN / 2)) * 30) - 10, 25 + (j * 10)));
			}
		}
	}
	
	this.respawn = function() {
		LIVES--;
		score -= 50;
		_projectiles = [];
		_ship = new Ship();
	}
	
	this.makeBlockades = function() {
		_blockades = [];
		
		for(var i = 1; i <= 4; i++) {
			_blockades.push(new Blockade(i * (canvas.width / 5)));
			_blockades[i - 1].makeBlocks();
		}
	}
	
	this.processInput = function(elapsedTime) {
		if(_keys[37]) {
			_ship.moveLeft(elapsedTime);
		}
		
		if(_keys[39]) {
			_ship.moveRight(elapsedTime);
		}
			
		if(_keys[' '.charCodeAt(0)]) {
			var proj = _ship.fire();
			
			if(proj != null) {
				_projectiles.push(proj);
			}
		}
	}
	
	this.updateGameObjects = function(elapsedTime) {
		for(var i in _projectiles) {
			if(_projectiles[i].life < 0) {
				_projectiles.splice(i, 1);
			} else {
				_projectiles[i].update(elapsedTime);
			}
		}
		
		for(var i in _invaders) {
			if((_invaders[i].direction == 1 && _invaders[i].x >= (canvas.width - _invaders[i].width - 20)) || (_invaders[i].direction == -1 && _invaders[i].x <= 20)) {
				hitSide = true;
			}
			
			if(Math.floor((Math.random() * Math.max(_invaders.length * (_invaders.length + _invaders.length / 2), 100)) + 1) == 1) {
				var proj = _invaders[i].fire();
				
				if(proj != null) {
					_projectiles.push(proj);
				}
			}
			
			if(_invaders[i].dead) {
				_invaders.splice(i, 1);
			}
			
			if(_invaders[i].y >= canvas.height - 15) {
				_gameLose = true;
			}
		}
		
		for(var i in _invaders) {
			if(hitSide) {
				_invaders[i].direction = 0;
			}
			
			_invaders[i].update(elapsedTime, INVADER_MOVE_SPEED);
		}
		
		hitSide = false;
		
		if(_invaders.length == 0) {
			_gameWin = true;
		} else if(_invaders.length <= 10 && INVADER_MOVE_SPEED == 500) {
			INVADER_MOVE_SPEED = INVADER_SPEED_BOOST1;
		} else if(_invaders.length < 5 && INVADER_MOVE_SPEED == INVADER_SPEED_BOOST1) {
			INVADER_MOVE_SPEED = INVADER_SPEED_BOOST2;
		}	
	}
	
	this.checkCollisions = function() {
		projectileLoop:
		for(p in _projectiles) {
			for(var i in _invaders) {
				if(_projectiles[p].hit(_invaders[i]) && !_projectiles[p].enemyShot) {
					score += 10;
					_invaders.splice(i, 1);
					_projectiles.splice(p, 1);
					continue projectileLoop;
				}
			}
			
			for(var i in _blockades) {
				for(var j in _blockades[i].Blocks) {
					if(_projectiles[p].hit(_blockades[i].Blocks[j], true)) {
						_projectiles.splice(p, 1);
						_blockades[i].Blocks.splice(j, 1);
						continue projectileLoop;
					}
				}
			}
			
			if(_projectiles[p].hit(_ship) && _projectiles[p].enemyShot) {
				_projectiles.splice(p, 1);
				_this.respawn();
				
				if(LIVES == 0) {
					_gameLose = true;
				}
			}
		}
	}
	
	this.draw = function() {
		_ctx.beginPath();
		
		_ctx.fillStyle = "black";
		_ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		_ctx.font = "10px Ariel";
		_ctx.fillStyle = "white";
		_ctx.textAlign = "start";
		_ctx.fillText("Score: " + score, 5, 10);
		
		for(var i = 1; i <= LIVES; i++) {
			_ctx.drawImage(document.getElementById("ship"), canvas.width - (i * 15 + (i * 5) + 5), 5, 15, 4.5);
		}
		
		_ctx.fillStyle = "white";
		_ctx.fillRect(15, canvas.height - 7.5, canvas.width - 30, 1);
		
		_ship.draw(_ctx);
		
		for(var i in _blockades) {
			_blockades[i].draw(_ctx);
		}
		
		for(var i in _projectiles) {
			_projectiles[i].draw(_ctx);
		}
			
		for(var i in _invaders) {
			_invaders[i].draw(_ctx);
		}
	}
}