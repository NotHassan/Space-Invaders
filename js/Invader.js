var Invader = function(x, y) {
	var invader = "invader1";
	var lastMove = null;
	
	this.x = x;
	this.y = y;
	this.width = 20;
	this.height = 6;
	this.direction = 1;
	this.lastDirection = this.direction;
	this.dead = false;
	
	this.update = function(elapsedTime, moveSpeed) {
		var time = (new Date().getTime());
		
		if(time - lastMove > moveSpeed) {
			this.x += 7.5 * this.direction;
			
			if(this.direction == 0) {
				this.y += 10;
				
				if(this.lastDirection == 1) {
					this.direction = -1;
				} else if(this.lastDirection == -1) {
					this.direction = 1;
				}
				
				this.lastDirection = this.direction;
			}
			
			invader = (invader == "invader1") ? "invader2" : "invader1";
			lastMove = time;
		}
	}
	
	this.fire = function() {
		var shot = new Projectile(this.x + this.width / 2, this.y, true);
		
		return shot;
	}
	
	this.draw = function(ctx) {
		ctx.beginPath();
		ctx.drawImage(document.getElementById(invader), this.x, this.y, this.width, this.height);
	}
}