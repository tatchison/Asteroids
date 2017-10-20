// ship.js

export default class Ship{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.vector = {
			x: 5,
			y: 5
		}
		this.angle = 20;
		this.speed = 5;
	}
	
	/** @method update
	*	updates the ship's position based on player input
	*/
	update(left, right, up){
		if(left){
			//rotate counterclockwise
		}
		else if(right){
			//rotate clockwise
		}
		if(up){
			this.x = this.x + this.vector.x;
			this.y = this.y + this.vector.y;
		}
		if(this.x >= 300)this.x = 0;
		else if(this.x <= 0)this.x = 300;
		if(this.y >= 150)this.y = 0;
		else if(this.y <= 0)this.y = 150;
	}
	
	/** @method render
	*	renders the ship on the given canvas context
	*/
	render(ctx){
		ctx.save();
		ctx.beginPath();
		/*ctx.translate(0,0);
		ctx.rotate(this.angle);
		ctx.translate(this.x, this.y)
		ctx.moveTo(0, -5);
		ctx.lineTo(2, 5);
		ctx.lineTo(-2, 5);*/
		ctx.moveTo(this.x, this.y - 5);
		ctx.lineTo(this.x + 2, this.y + 5);
		ctx.lineTo(this.x - 2, this.y + 5);
		ctx.strokeStyle = 'white';
		ctx.closePath();
		ctx.stroke();
		ctx.restore()
	}
}