let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;
let speed = 8;
let acceleration = 1;
let isAcceleration = true;
let roadMove = -60;
let roadIntervalID, carsIntervalID;
let isGameOver = false;
let score = 0;

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
	$(".controlField").css({display: "grid"});
}

function backGround() {
	ctx.fillStyle = "#c5dd73";
	ctx.strokeStyle = "#c5dd73";
	ctx.fillRect(0, 0, width, height);
}

function road() {
	ctx.fillStyle = "#555";
	ctx.fillRect(width / 4, 0, width / 2, height);
}

function dividingLine() {
	ctx.beginPath();
	ctx.strokeStyle = "white";
	ctx.setLineDash([10]);
	ctx.lineDashOffset = 10;
	ctx.lineWidth = 2;
	ctx.moveTo(width / 2, roadMove);
	ctx.lineTo(width / 2, height);
	ctx.stroke();
}

backGround()
road();
dividingLine();

function roadAnimate() {
	roadIntervalID = setTimeout(function() {
		roadMove += acceleration;
		ctx.clearRect(0, 0, width, height);
		backGround()
		road();
		dividingLine();
		if(roadMove >= -20) {
			roadMove = -60;
		}
		roadAnimate();
	}, speed / 4);
}

let MyCar = function(x, y, linkCar) {
	this.x = x;
	this.y = y;
	this.draw(linkCar);
	this.direction = "";
	this.movementAllowed = false;
}
MyCar.prototype.setDirection = function(isRightDirection, isDownDirection, isLeftDirection, isUpDirection, isStopDirection) {
	this.isRightDirection = isRightDirection;
	this.isDownDirection = isDownDirection;
	this.isLeftDirection = isLeftDirection;
	this.isUpDirection = isUpDirection;
	this.isStopDirection = isStopDirection;
}
MyCar.prototype.draw = function(linkCar){
	let carHTML = `<img src=${linkCar} class="myCar">`;
	this.carElement = $(carHTML);
	this.carElement.css({
		position: "absolute",
		width: "120px",
		left: this.x,
		top: this.y,
		transform: 'rotate(-90deg)',
		zIndex: "1"
	});
	$(".content").append(this.carElement);
};
MyCar.prototype.moveRight = function(){
	let self = this;
	self.x += (5 + acceleration);
	self.carElement.css({
		left: self.x,
		top: self.y
	});
};
MyCar.prototype.moveLeft = function(){
	let self = this;
	self.x -= (5 + acceleration);
	self.carElement.css({
		left: self.x,
		top: self.y
	});
};
MyCar.prototype.moveDown = function(){
	let self = this;
	self.y += (5 + acceleration);
	self.carElement.css({
		left: self.x,
		top: self.y
	});
};
MyCar.prototype.moveUp = function(){
	let self = this;
	self.y -= (5 + acceleration);
	self.carElement.css({
		left: self.x,
		top: self.y
	});
};
MyCar.prototype.stop = function(){
	let self = this;
	self.carElement.css({
		left: self.x,
		top: self.y
	});
};
MyCar.prototype.move = function(newDirection){
	let self = this;
	if(self.movementAllowed) {
		if (self.isStopDirection) {
			self.stop();
		}
		if ((self.x > 100 && self.x < 280) && (self.y > 40 && self.y < 380) ) {
			if (self.isUpDirection) {
				self.moveUp();
			}
			else if (self.isLeftDirection) {
				self.moveLeft();
			}
			else if (self.isRightDirection) {
				self.moveRight();
			}
			else if (self.isDownDirection) {
				self.moveDown();
			}
		}
		else if (self.x <= 100 && (self.y > 40 && self.y < 380)) {
			if (self.isUpDirection) {
				self.moveUp();
			}
			else if (self.isRightDirection) {
				self.moveRight();
			}
			else if (self.isDownDirection) {
				self.moveDown();
			}
		}
		else if (self.x >= 280 && (self.y > 40 && self.y < 380)) {
			if (self.isUpDirection) {
				self.moveUp();
			}
			else if (self.isLeftDirection) {
				self.moveLeft();
			}
			else if (self.isDownDirection) {
				self.moveDown();
			}
		}
		else if (self.y <= 40 && (self.x > 100 && self.x < 280)) {
			if (self.isRightDirection) {
				self.moveRight();
			}
			else if (self.isLeftDirection) {
				self.moveLeft();
			}
			else if (self.isDownDirection) {
				self.moveDown();
			}
		}
		else if (self.y >= 380 && (self.x > 100 && self.x < 280)) {
			if (self.isRightDirection) {
				self.moveRight();
			}
			else if (self.isLeftDirection) {
				self.moveLeft();
			}
			else if (self.isUpDirection) {
				self.moveUp();
			}
		}
		else if (self.x <= 100 && self.y <= 40) {
			if (self.isRightDirection) {
				self.moveRight();
			}
			else if (self.isDownDirection) {
				self.moveDown();
			}
		}
		else if (self.x >= 280 && self.y <= 40) {
			if (self.isLeftDirection) {
				self.moveLeft();
			}
			else if (self.isDownDirection) {
				self.moveDown();
			}
		}
		else if (self.x <= 100 && self.y >= 380) {
			if (self.isRightDirection) {
				self.moveRight();
			}
			else if (self.isUpDirection) {
				self.moveUp();
			}
		}
		else if (self.x >= 280 && self.y >= 380) {
			if (self.isLeftDirection) {
				self.moveLeft();
			}
			else if (self.isUpDirection) {
				self.moveUp();
			}
		}
		if(newDirection === "stop") {
			self.setDirection(false, false, false, false, true);
			newDirection = '';
		}
		else if(newDirection === "up") {
			self.setDirection(false, false, false, true, false);
			newDirection = '';
		}
		else if(newDirection === "left") {
			self.setDirection(false, false, true, false, false);
			newDirection = '';
		}
		else if(newDirection === "right") {
			self.setDirection(true, false, false, false, false);
			newDirection = '';
		}
		else if(newDirection === "down") {
			self.setDirection(false, true, false, false, false);
			newDirection = '';
		}
	}
}

let directions = {
	37: "left",
	38: "up",
	39: "right",
	40: "down"
};

$("body").keydown(function (event) {
	if(!isGameOver) {
		let newDirection = directions[event.keyCode];
		if (newDirection !== undefined){
			car.move(newDirection);
		}
	}
});
$("body").keyup(function (event) {
	car.move("stop");
});
$(".controlField").on("touchstart", function(event) {
	if(event.target.closest('button')) {
		car.move(`${event.target.id}`);
	}
});
$(".controlField").on("touchend", function(event) {
	car.move("stop");
});


let car = new MyCar(130, 350, "./icons/myCar.png");

let OtherCars = function(x, y, linkCar) {
	this.x = x;
	this.y = y;
	this.draw(linkCar);
	this.isFirstOvertaking = false;
}
OtherCars.prototype.draw = function(linkCar){
	let carHTML = `<img src=${linkCar} class="otherCar">`;
	this.carElement = $(carHTML);
	this.carElement.css({
		position: "absolute",
		width: "120px",
		left: this.x,
		top: this.y,
		transform: 'rotate(-90deg)',
		zIndex: "1"
	});
	$(".content").append(this.carElement);
};
OtherCars.prototype.moveDown = function(){
	let self = this;
	self.y += acceleration;
	self.carElement.css({
		left: self.x,
		top: self.y
	});
};
OtherCars.prototype.move = function() {
	let self = this;
	if(score > 0 && score % 9 === 0 && isAcceleration) {
		acceleration += 0.5;
		isAcceleration = false;
	}
	if(Math.ceil($(".myCar").position().top) + $(".myCar").width() <= Math.ceil(self.y)) {
		if(!self.isFirstOvertaking) {
			++score;
			--speed;
			$(".score").text(`Score: ${score}`);
			self.isFirstOvertaking = true;
			isAcceleration = true;
		}
	} 
	if($(".myCar").position().top < self.y) {
		self.carElement.css({
			zIndex: "0"
		})
	}
	else {
		self.carElement.css({
			zIndex: "1"
		})
	}
	if ($(".myCar").position().left >= self.x - $(".otherCar").height() + 25 && $(".myCar").position().left - $(".myCar").width() <= self.x - 25 
		&& $(".myCar").position().top - $(".myCar").width() <= self.y  - 25 && $(".myCar").position().top >= self.y - $(".otherCar").width() - 17.5) {
		isGameOver = true;
		console.log("lose");
		clearTimeout(roadIntervalID);
		clearInterval(carsIntervalID);
		car.setDirection(false, false, false, false, true);
		let explosion1 = new Explosion(self.x, self.y, "./icons/explosion.gif");
		let explosion2 = new Explosion($(".myCar").position().left - 25, $(".myCar").position().top, "./icons/explosion.gif");
	}
	self.moveDown();
	if(self.y > 550) {
		self.y = -400;
		self.isFirstOvertaking = false;
	}
}

let otherCar1 = new OtherCars(130, -50, "./icons/otherCar.png");
let otherCar2 = new OtherCars(250, -490, "./icons/otherCar.png");

function startCars() {
	carsIntervalID = setInterval(function() {
		otherCar1.move();
		otherCar2.move();
	}, speed / 2);
};

let Explosion = function(x, y, link) {
	this.x = x;
	this.y = y;
	this.draw(link);
}
Explosion.prototype.draw = function(link){
	let carHTML = `<img src=${link}>`;
	this.carElement = $(carHTML);
	this.carElement.css({
		position: "absolute",
		width: "120px",
		left: this.x,
		top: this.y,
		transform: 'rotate(-90deg)',
		zIndex: "1"
	});
	$(".content").append(this.carElement);
};

$(".key_restart").on("click", function() {
	location.reload();
});
$(".key_start").on("click", function() {
	car.movementAllowed = true;
	roadAnimate();
	startCars();
})