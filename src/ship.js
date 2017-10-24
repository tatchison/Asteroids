// ship.js

import * as Vector from './vector';

export default class Ship{
	constructor(x, y){
		this.position = {
			x: x,
			y: y
		};
		this.angle = 20;
		this.speed = 5;
	}
	
	/** @method update
	*	updates the ship's position based on player input
	*/
	update(left, right, up){
		if(left){
			this.angle += 0.1;
		}
		else if(right){
			this.angle -= 0.1;
		}
		//need to treat forward movement like laser object
		//will do that once direction is figured out
		if(up){
			var move = {x: 0, y: 1};
			var rot = Vector.rotate(move, this.angle);
			var scale = Vector.scalarmult(rot, this.speed);
			this.position = Vector.add(this.position, scale);
			
		}
		if(this.position.x > 300)this.position.x = 0;
		else if(this.position.x < 0)this.position.x = 300;
		if(this.position.y > 150)this.position.y = 0;
		else if(this.position.y < 0)this.position.y = 150;
	}
	
	/** @method render
	*	renders the ship on the given canvas context
	*/
	render(ctx){
		ctx.save();
		ctx.beginPath();
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(-this.angle);
		ctx.moveTo(0,-5);
		ctx.lineTo(2, 5);
		ctx.lineTo(-2, 5);
		ctx.strokeStyle = 'white';
		ctx.closePath();
		ctx.stroke();
		ctx.restore()
	}
}