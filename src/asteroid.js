//asteroid.js

import * as Vector from './vector';

export default class Asteroid{
	constructor(mass, position, velocity){
		//code for this function comes from API for Math.random on MDN website
		function getRandomVal(min, max){
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max-min)) + min;
		}
		if(mass === 0){
			this.position = {
				x: getRandomVal(10, 290),
				y: getRandomVal(10, 140)
			};
			if(this.position.x > 130 && this.position.x < 170 && this.position.y > 55 && this.position.y < 95){
				var rand = Math.random();
				if(rand < 0.5){
					this.position.x += 20;
					this.position.y += 20;
				}
				else{
					this.position.x -= 20;
					this.position.y -= 20;
				}
			}
			var m = Math.random();
			this.mass;
			if(m < 0.6) this.mass = 18;//30% chance
			else this.mass = 9;
			this.velocity;
			if(this.mass === 18){
				this.velocity = {
					x: getRandomVal(1,2),
					y: getRandomVal(1,2)
				};
			}
			else{
				this.velocity = {
					x: getRandomVal(2,3),
					y: getRandomVal(2,3)
				};
			}
			var vx = Math.random();
			if(vx < 0.5)this.velocity.x *= -1;
			var vy = Math.random();
			if(vy < 0.5)this.velocity.y *= -1;
			this.radius = this.mass/3;
		}
		else{
			this.mass = 9;
			this.radius = this.mass/3;
			this.position = position;
			this.velocity = velocity;
		}
		this.getPosition = this.getPosition.bind(this);
		this.setVelocity = this.setVelocity.bind(this);
	}
	
	getPosition(){
		return this.position;
	}
	
	setVelocity(v){
		this.velocity = v;
	}
	
	update(){
		this.position = Vector.add(this.position, this.velocity);
		if(this.position.x > 300)this.position.x = 0;
		else if(this.position.x < 0)this.position.x = 300;
		if(this.position.y > 150)this.position.y = 0;
		else if(this.position.y < 0)this.position.y = 150;
	}
	
	render(ctx){
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = '#fff';
		ctx.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI, false);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}
}