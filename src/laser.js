//laser.js

import * as Vector from './vector';

export default class Laser{
	constructor(vector, angle){
		this.radius = 1;
		this.position = vector;
		this.angle = angle;
		this.speed = 10;
		this.oob = false;
		this.OOB = this.OOB.bind(this);
	}
	
	OOB(){
		if(this.position.x >= 300 || this.position.x <= 0 || this.position.y >= 150 || this.position.y <= 0){
			return true;
		}
		return false;
	}
	
	 update(){
		var rot = Vector.rotate({x: 0, y: 1}, this.angle);
		var scale = Vector.scalarmult(rot, this.speed);
		this.position = Vector.add(this.position, scale);
	 }
	 
	 render(ctx){
		 ctx.save();
		 ctx.fillStyle = '#fff';
		 ctx.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI, false);
		 ctx.fill();
		 ctx.closePath();
		 ctx.restore();
	 }
}