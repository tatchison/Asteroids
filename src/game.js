//game.js

import Ship from './ship';
import Laser from './laser';
import * as Vector from './vector';

export default class Game{
	constructor(){
		this.ship = new Ship(150, 75);
		this.lasers = [];
		//create the initial asteroids
		this.points = 0;
		this.stock = 3;
		this.width = 300;
		this.height = 150;
		this.gwidth = 15;
		this.gheight = 15;
		//reset to default false when finisehd tinkering with ship
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
		//set up event handlers
		window.onkeydown = this.handleKeyDown;
		window.onkeyup = this.handleKeyUp;
		//set up game loop
		this.interval = setInterval(this.loop, 50);
	}
	
	handleKeyDown(event){
		event.preventDefault();
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
				this.lasers.push(new Laser({x: this.ship.x, y: this.ship.y}, 
					this.ship.angle));
				this.lfire.play();
				break;
		}
	}
	
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
			var ind = 0;
			this.lasers.forEach((laser) => {
				laser.update();
				if(laser.OOB()){
					this.lasers.splice(ind, 1);
				}
				ind++;
			});
		}
	}
	
	render(){
		this.backCtx.clearRect(0, 0, this.width, this.height);
		this.ship.render(this.backCtx);
		this.lasers.forEach((laser) => {
			laser.render(this.backCtx);
		})
		this.screenCtx.clearRect(0, 0, this.width, this.height);
		this.screenCtx.drawImage(this.backBufferCanvas, 0, 0);
	}
	
	loop(){
		this.update();
		this.render();
	}
}