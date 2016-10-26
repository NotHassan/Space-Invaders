var Ship = function() {
	var MOVE_SPEED = 200;
	var RELOAD_TIME = 400;
	
	var _this = this;
	var lastFire = null;
	
	this.x = canvas.width / 2 - 10;
	this.y = canvas.height - 14;
	this.width = 20;
	this.height = 6;
	
	this.moveLeft = function(elapsedTime) {
		if(this.x > 20) {
			this.x -= MOVE_SPEED * elapsedTime;
		}
	}
	
	this.moveRight = function(elapsedTime) {
		if(this.x < canvas.width - 38) {
			this.x += MOVE_SPEED * elapsedTime;
		}
	}
	
	this.fire = function() {
		var time = (new Date().getTime());
		
		if((time - lastFire) >= RELOAD_TIME) {
			var shot = new Projectile(this.x + this.width / 2, canvas.height - 14, false);
			shot.enemyShot = false;
			
			lastFire = time;
			
			return shot;
		}
	}
	
	this.draw = function(ctx) {
		ctx.beginPath();
		ctx.drawImage(document.getElementById("ship"), this.x, canvas.height - 14, this.width, this.height);
	}
}