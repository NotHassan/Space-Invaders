var Projectile = function(x, y, invader) {
	var MOVE_SPEED = 200;
	var LIFE_SPAN = 1;
	
	this.x = x;
	this.y = y;
	this.width = 1;
	this.height = 5;
	this.enemyShot = true;
	this.life = LIFE_SPAN;
	
	this.update = function(elapsedTime) {
		if(invader) {
			this.enemyShot = true;
			this.y += MOVE_SPEED / 2 * elapsedTime;
		}
		else {
			this.enemyShot = false;
			this.y -= MOVE_SPEED * elapsedTime;
		}
		
		this.life -= elapsedTime;
	}
	
	this.hit = function(obj, blockade) {
		if(blockade) {
			return !(this.x + this.width < obj.parent.x + obj.x * obj.width ||
				obj.parent.x + obj.x * obj.width + obj.width < this.x ||
				this.y + this.height < obj.parent.y + obj.y * obj.height ||
				obj.parent.y + obj.y * obj.height + obj.height < this.y);
		} else {
			return !(this.x + this.width < obj.x ||
				obj.x + obj.width < this.x ||
				this.y + this.height < obj.y ||
				obj.y + obj.height < this.y);
		}
	}
	
	this.draw = function(ctx) {
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}