//asteroid.js

import * as Vector from './vector';

export default class Asteroid{
	constructor(width, height){
		//code for this function comes from API for Math.random on MDN website
		function getRandomVal(min, max){
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max-min)) + min;
		}
		this.vector = {
			x: getRandomVal(10, width-10),
			y: getRandomVal(10, height-10)
		};
		if(this.vector.x > 130 && this.vector.x < 170 && this.vector.y > 55 && this.vector.y < 95){
			var rand = Math.random();
			if(rand < 0.5){
				this.vector.x += 20;
				this.vector.y += 20;
			}
			else{
				this.vector.x -= 20;
				this.vector.y -= 20;
			}
		}
		//these are to figure out grid sections for checking collisions
		//this.gx = this.vector.x/gwidth;
		//this.gy = this.vector.y/gheight;
		//what random val for angle?
		var m = Math.random();
		this.radius;
		this.speed = 1;
		if(m < 0.1) this.radius = 15;//10% chance
		else if(m < 0.50)this.radius = 12;//40% chance
		else this.radius = 9;//50% chance
	}
	
	render(ctx){
		console.log("render called");
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = '#fff';
		ctx.arc(this.vector.x, this.vector.y, (this.radius)/3, 0, 2*Math.PI, false);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}
}