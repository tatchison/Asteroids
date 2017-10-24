//game.js

import Ship from './ship';
import Laser from './laser';
import Asteroid from './asteroid';
import * as Vector from './vector';

export default class Game{
	constructor(){
		this.width = 300;
		this.height = 150;
		this.ship = new Ship(150, 75);
		this.lasers = [];
		//create the initial asteroids
		this.asteroids = [];
		for(var i = 0; i < 10; i++){
			this.asteroids.push(new Asteroid(0, {x:0, y:0}, {x:0, y:0}));
		}
		this.points = 0;
		this.stock = 3;
		this.over = false;
		this.left = false;
		this.right = false;
		this.up = false;
		this.space = false;
		//Create the back buffer canvas
		this.backBufferCanvas = document.createElement('canvas');
		this.backBufferCanvas.width = this.width;
		this.backBufferCanvas.height = this.height;
		this.backCtx = this.backBufferCanvas.getContext('2d');
		// Create the screen buffer canvas
		this.screenBufferCanvas = document.createElement('canvas');
		this.screenBufferCanvas.width = this.width;
		this.screenBufferCanvas.height = this.height;
		document.body.appendChild(this.screenBufferCanvas);
		this.screenCtx = this.screenBufferCanvas.getContext('2d');
		//HTML UI elements
		var score = document.createElement('div');
		score.id = "score";
		score.textContent = "Score: " + this.points;
		document.body.appendChild(score);
		var lives = document.createElement('div');
		lives.id = "lives";
		lives.textContent = "Lives: " + this.stock;
		document.body.appendChild(lives);
		var message = document.createElement('div');
		message.id = "message";
		document.body.appendChild(message);
		var instructions = document.createElement('div');
		instructions.id = "instructions";
		instructions.textContent = "LeftArrow: turn left;RightArrow: turn right;Up Arrow: move forward;Spacebar: shoot";
		document.body.appendChild(instructions);
		//sound elements
		this.lfire = document.createElement('audio');
		this.lfire.src = 'laserfire.wav';
		this.lhit = document.createElement('audio');
		this.lhit.src = 'laserhit.wav';
		this.ahit = document.createElement('audio');
		this.ahit.src = 'asteroidhit.wav';
		this.sdie = document.createElement('audio');
		this.sdie.src = 'shipdies.wav';
		//Bind class functions
		this.update = this.update.bind(this);
		this.render = this.render.bind(this);
		this.loop = this.loop.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.getGrid = this.getGrid.bind(this);
		this.checkCollisionCircle = this.checkCollisionCircle.bind(this);
		this.getV1 = this.getV1.bind(this);
		this.getV2 = this.getV2.bind(this);
		this.findAxes = this.findAxes.bind(this);
		this.project = this.project.bind(this);
		this.detectShipCollision = this.detectShipCollision.bind(this);
		//set up event handlers
		window.onkeydown = this.handleKeyDown;
		window.onkeyup = this.handleKeyUp;
		//set up game loop
		this.interval = setInterval(this.loop, 50);
	}
	
	/** @method gameOver
	*	handles a game over scenario
	*/
	gameOver(){
		this.over = true;
		var message = document.getElementById('message');
		message.textContent = "Game Over";
	}
	
	/** @method getGrid
	*	gets the grid coordinates of the given position
	*/
	getGrid(position){
		return {x: Math.ceil(position.x/15), y: Math.ceil(position.y/15)};
	}
	
	/** @method checkCollisionCircle
	*	checks for collisions between an asteroid and a laser or other asteroid
	*/
	checkCollisionCircle(p1, r1, p2, r2){
		var distanceSquared = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
		if(distanceSquared < Math.pow(r1 + r2,2))return true;
		else return false;
	}
	
	/** @method findAxes
	*	finds the axes of a given shape
	*/
	findAxes(shape){
		var axes = [];
		shape.forEach(function(p1, i){
			var p2 = (shape.length == i + 1) ? 0 : shape[i];
			var edge = Vector.subtract(p2, p1);
			var perp = Vector.perpendicular(edge);
			var normal = Vector.normalize(perp);
			axes.push(normal);
		});
		return axes;
	}
	
	project(shape, axis){
		var min = Vector.dotProduct(shape[0], axis);
		var max = min;
		for(var i = 0; i < shape.length; i++){
			var p = Vector.dotProduct(shape[i], axis);
			if(p < min) min = p;
			else if (p > max) max = p;
		}
		return {min: min, max: max};
	}
	
	detectShipCollision(ship, rock, radius){
		var axes = this.findAxes(ship) + this.findAxes(rock);
		for(var i = 0; i < axes.length; i++){
			var proj1 = this.project(ship, axes[i]);
			var proj2 = this.project(rock, axes[i]);
			proj2.min = proj2.min + radius;
			proj2.max = proj2.max - radius;
			if(proj1.max < proj2.min || proj1.min > proj2.max){
				return false;
			}
		}
		return true;
	}
	
	/** @method newLevel
	*	on ship collision with asteroid, resets board and decreases lives
	*/
	newLevel(type){
		if(type === "dead"){
			this.stock--;
			var lives = document.getElementById("lives");
			lives.textContent = "Lives: " + this.stock;
			if(this.stock === 0)return this.gameOver();
		}
		if(type !== "dead")this.points += 1000;
		var score = document.getElementById('score');
		score.textContent = "Score: " + this.points;
		this.ship.position.x = 150;
		this.ship.position.y = 75;
		this.ship.angle = 20;
		this.asteroids = [];
		for(var i = 0; i < 10; i++){
			this.asteroids.push(new Asteroid(0, {x:0, y:0}, {x:0, y:0}));
		}
		this.lasers = [];
	}
	
	/** @method getV1
	*	Gets the final velocity for object 1
	*/
	getV1(m1, m2, v1, v2){
		return ((m1*v1)+(m2*v2)-(m2*(v1-v2)))/(m1 + m2);
	}
	
	/** @method getV2
	*	Gets the final velocity for object 2
	*	Used after final velocity of object 1 is found
	*/
	getV2(m1, m2, v1, v2, v1f){
		return ((m1*v1)+(m2*v2)-(m1*v1f))/m2;
	}
	
	/** @method handleKeyDown
	*	event handler for key down
	*/
	handleKeyDown(event){
		event.preventDefault();
		var s = event.key;
		switch(event.key){
			case "ArrowLeft":
				this.left = true;
				break;
			case "ArrowRight":
				this.right = true;
				break;
			case "ArrowUp":
				this.up = true;
				break;
			case " ":
				//fire a bullet
				if(!this.over){
					this.lasers.push(new Laser({x: this.ship.position.x, y: this.ship.position.y}, 
						this.ship.angle));
					this.lfire.play();
				}
				break;
		}
	}
	
	/** @method handleKeyUp
	*	event handler for key up
	*/
	handleKeyUp(event){
		event.preventDefault();
		switch(event.key){
			case "ArrowLeft":
				this.left = false;
				break;
			case "ArrowRight":
				this.right = false;
				break;
			case "ArrowUp":
				this.up = false;
				break;
		}
	}
	
	update(){
		if(!this.over){
			this.ship.update(this.left, this.right, this.up);
			//check for asteroid collision
			this.asteroids.forEach((rock) => {
				var g1 = this.getGrid(this.ship.position);
				var g2 = this.getGrid(rock.getPosition());
				//if the ship and asteroid are in the same "grid", then check for collision
				if(g1.x === g2.x && g1.y === g2.y){
					var shipEdges = [];
					var a = {x: 0, y: -5};
					var b = {x: 2, y: 5};
					var c = {x: -2, y: 5};
					a = Vector.rotate(a, this.ship.angle);
					b = Vector.rotate(b, this.ship.angle);
					c = Vector.rotate(c, this.ship.angle);
					var A = Vector.add(this.ship.position, a);
					var B = Vector.add(this.ship.position, b);
					var C = Vector.add(this.ship.position, c);
					shipEdges.push(Vector.subtract(A, B));
					shipEdges.push(Vector.subtract(B, C));
					shipEdges.push(Vector.subtract(C, A));
					var rockEdge = [];
					rockEdge.push(rock.getPosition());
					//collision is checked by Seperating Axis Theorem
					if(this.detectShipCollision(shipEdges, rockEdge, rock.radius)){
						this.sdie.play();
						return this.newLevel("dead");
					}
				}
			});
			var ind = 0;
			var newRocks = [];
			this.lasers.forEach((laser) => {
				laser.update();
				if(laser.OOB()){
					this.lasers.splice(ind, 1);
				}
				var ind2 = 0;
				this.asteroids.forEach((rock) => {
					var g1 = this.getGrid(laser.position);
					var g2 = this.getGrid(rock.getPosition());
					if(g1.x === g2.x && g1.x === g2.x){
						if(this.checkCollisionCircle(laser.position, laser.radius, rock.getPosition(), rock.radius)){
							this.lasers.splice(ind, 1);
							if(rock.mass === 18){
								var v1;
								var v2;
								var newPos1;
								var newPos2;
								var pos = rock.getPosition();
								if(laser.position.x < pos.x && laser.position.y < pos.y){
									newPos1 = {x: pos.x - 3, y: pos.y + 3};
									newPos2 = {x: pos.x + 3, y: pos.y - 3};
									if(rock.velocity.x < 0 && rock.velocity.y < 0){
										v1 = {x: rock.velocity.x, y: rock.velocity.y*-1};
										v2 = {x: rock.velocity.x*-1, y: rock.velocity.y};
									}
									else if(rock.velocity.x < 0 && rock.velocity.y > 0){
										v1 = rock.velocity;
										v2 = Vector.scalarmult(rock.velocity, -1);
									}
									else if(rock.velocity.x > 0 && rock.velocity.y > 0){
										v1 = {x: rock.velocity.x, y: rock.velocity.y*-1};
										v2 = {x: rock.velocity.x*-1, y: rock.velocity.y};
									}
									else{
										v1 = Vector.scalarmult(rock.velocity, -1);
										v2 = rock.velocity;
									}
								}
								else if(laser.position.x > rock.getPosition().x && laser.position.y < rock.getPosition().y){
									newPos1 = {x: pos.x - 3, y: pos.y - 3};
									newPos2 = {x: pos.x + 3, y: pos.y + 3};
									if(rock.velocity.x < 0 && rock.velocity.y < 0){
										v1 = rock.velocity;
										v2 = Vector.scalarmult(rock.velocity, -1);
									}
									else if(rock.velocity.x < 0 && rock.velocity.y > 0){
										v1 = {x: rock.velocity.x, y: rock.velocity.y*-1};
										v2 = {x: rock.velocity.x*-1, y: rock.velocity.y};
									}
									else if(rock.velocity.x > 0 && rock.velocity.y > 0){
										v2 = Vector.scalarmult(rock.velocity, -1);
										v1 = rock.velocity;
									}
									else{
										v1 = {x: rock.velocity.x, y: rock.velocity.y*-1};
										v2 = {x: rock.velocity.x*-1, y: rock.velocity.y};
									}
								}
								else if(laser.position.x > pos.x && laser.position.y > pos.y){
									newPos1 = {x: pos.x - 3, y: pos.y + 3};
									newPos2 = {x: pos.x + 3, y: pos.y -3};
									if(rock.velocity.x < 0 && rock.velocity.y < 0){
										v1 = {x: rock.velocity.x, y: rock.velocity.y*1};
										v2 = {x: rock.velocity.x*-1, y: rock.velocity.y};
									}
									else if(rock.velocity.x < 0 && rock.velocity.y > 0){
										v1 = rock.velocity;
										v2 = Vector.scalarmult(rock.velocity, -1);
									}
									else if(rock.velocity.x > 0 && rock.velocity.y > 0){
										v1 = {x: rock.velocity.x, y: rock.velocity.y*1};
										v2 = {x: rock.velocity.x*-1, y: rock.velocity.y};
									}
									else{
										v1 = Vector.scalarmult(rock.velocity, -1);
										v2 = rock.velocity;
									}
								}
								else{
									newPos1 = {x: pos.x - 3, y: pos.y - 3};
									newPos2 = {x: pos.x + 3, y: pos.y + 3};
									if(rock.velocity.x < 0 && rock.velocity.y < 0){
										v1 = rock.velocity;
										v2 = Vector.scalarmult(rock.velocity, -1);
									}
									else if(rock.velocity.x < 0 && rock.velocity.y > 0){
										v1 = {x: rock.velocity.x, y: rock.velocity.y*1};
										v2 = {x: rock.velocity.x*-1, y: rock.velocity.y};
									}
									else if(rock.velocity.x > 0 && rock.velocity.y > 0){
										v1 = Vector.scalarmult(rock.velocity, -1);
										v2 = rock.velocity;
									}
									else{
										v1 = {x: rock.velocity.x*-1, y: rock.velocity.y};
										v2 = {x: rock.velocity.x, y: rock.velocity.y*1};
									}
								}
								//adjust position vectors based on how collision occurs
								newRocks.push(new Asteroid(1,newPos1, v1));
								newRocks.push(new Asteroid(1, newPos2, v2));
							}
							this.asteroids.splice(ind2, 1);
							this.points += 100;
							var score = document.getElementById('score');
							score.textContent = "Score: " + this.points;
							this.lhit.play();
						}
					}
					ind2++;
				});
				//concatenate asteroids and newRocks
				this.asteroids = this.asteroids.concat(newRocks);
				ind++;
			});
			if(this.asteroids.length === 0){
				return this.newLevel("win");
			}
			else{
				this.asteroids.forEach((rock) => {
					rock.update();
				});
				//have the asteroids check if they collide with each other
					//if so, adjust physics based on that
					for(var i = 0; i < this.asteroids.length; i++){
						for(var j = i + 1; j < this.asteroids.length; j++){
							var a = this.asteroids[i].getPosition();
							var b = this.asteroids[j].getPosition();
							var g1 = this.getGrid(a);
							var g2 = this.getGrid(b);
							if(g1.x === g2.x && g1.y === g2.y){
								if(this.checkCollisionCircle(a, this.asteroids[i].radius, b, this.asteroids[j].radius)){
									var diff = Vector.subtract(a,b);
									var angle = Math.atan2(diff.x, diff.y);
									var c = this.asteroids[i].velocity;
									var d = this.asteroids[j].velocity;
									var cx = this.getV1(this.asteroids[i].mass, this.asteroids[j].mass, c.x, d.x);
									var dx = this.getV2(this.asteroids[i].mass, this.asteroids[j].mass, c.x, d.x, cx);
									var cy = this.getV1(this.asteroids[i].mass, this.asteroids[j].mass, c.y, d.y);
									var dy = this.getV2(this.asteroids[i].mass, this.asteroids[j].mass, c.y, d.y, cy);
									c = {x: cx, y: cy};
									d = {x: dx, y: dy};
									//c = Vector.rotate(c, angle);
									//d = Vector.rotate(d, angle);
									this.asteroids[i].setVelocity(c);
									this.asteroids[j].setVelocity(d);
									this.ahit.play();
							}
						}
					}
				}
				
			}
		}
	}
	
	render(){
		if(!this.over){
			this.backCtx.clearRect(0, 0, this.width, this.height);
			this.ship.render(this.backCtx);
			this.lasers.forEach((laser) => {
				laser.render(this.backCtx);
			})
			this.asteroids.forEach((asteroid) => {
				asteroid.render(this.backCtx);
			})
			this.screenCtx.clearRect(0, 0, this.width, this.height);
			this.screenCtx.drawImage(this.backBufferCanvas, 0, 0);
		}
	}
	
	loop(){
		this.update();
		this.render();
	}
}