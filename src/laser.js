//laser.js

import * as Vector from './vector';

export default class Laser{
	constructor(vector, angle){
		this.radius = 1;
		this.vector = vector;
		this.angle = angle;
		this.speed = 5;
		this.oob = false;
		this.OOB = this.OOB.bind(this);
	}
	
	OOB(){
		if(this.vector.x >= 300 || this.vector.x <= 0 || this.vector.y >= 150 || this.vector.y <= 0){
			return true;
		}
		return false;
	}
	
	 update(){
		var rot = Vector.rotate({x: 0, y: 1}, this.angle);
		var scale = Vector.scalarmult(rot, this.speed);
		this.vector = Vector.add(this.vector, scale);
	 }
	 
	 render(ctx){
		 ctx.save();
		 ctx.fillStyle = '#fff';
		 ctx.arc(this.vector.x, this.vector.y, this.radius, 0, 2*Math.PI, false);
		 ctx.fill();
		 ctx.closePath();
		 ctx.restore();
	 }
}