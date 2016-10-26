var Blockade = function(x) {
	var _this = this;
	
	this.x = x - 22;
	this.y = canvas.height - 40;
	this.width = 10;
	this.height = 8;
	this.Blocks = [];
	
	this.checkPoint = function(x, y) {
		if(x < 2 && y < 2) {
			return false;
		}
		
		if(x >= this.width - 2 && y < 2) {
			return false;
		}
		
		if(x >= 2 && x < this.width - 2 && y >= this.height - 2) {
			return false;
		}
		
		return true;
	}
	
	this.makeBlocks = function() {
		for(var x = 0; x < this.width; x++) {
			for(var y = 0; y < this.height; y++) {
				if(this.checkPoint(x, y)) {
					this.Blocks.push(new blockadeBlock(x, y));
				}
			}
		}
	}
	
	this.draw = function(ctx) {
		for(var i in this.Blocks) {
			this.Blocks[i].draw(ctx, this.x, this.y);
		}
	}
	
	var blockadeBlock = function(x, y) {
		this.x = x;
		this.y = y;
		this.width = 4;
		this.height = 2;
		this.parent = _this;
		
		this.draw = function(ctx, x, y) {
			ctx.beginPath();
			ctx.fillStyle = "white";
			ctx.fillRect(x + this.x * this.width, y + this.y * this.height, this.width, this.height);
		}
	}
}