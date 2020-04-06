//to do: optimaliseren van vergroting van scherm
//to do: sterrebeelden kunnen laten roteren
//to do: sterren niet laten refreshen bij sizing maar laten bij komen


var canvas = document.querySelector('canvas')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d')

//--------Variables--------

var starRatio = 0.0007; //aantal sterren per vierkante pixel

var maxBigStarRadius = 1.5;
var bigStarGlow = 100; //Hoe neig een grote ster maximaal kan schijnen
var maxBigTwinkleSpeed = 100; //Hoe snel een grote ster zal twinkelen

var maxSmallStarRadius = 1;
var smallStarGlow = 20;
var maxSmallTwinkleSpeed = 800;

var twinkleAnimationSpeed = 0.02;

var oppScreen = canvas.width * canvas.height;
var totalSmallStars = starRatio * oppScreen;
var totalBigStars = totalSmallStars / 100;

var smallStarList = []
var bigStarList = []

var beeldScale = canvas.width / 1300;

var fadeSpeed = 0.005;



//--------Events--------

window.addEventListener('resize',
	function () {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		var oppScreen = canvas.width * canvas.height;
		var totalSmallStars = starRatio * oppScreen;
		var totalBigStars = totalSmallStars / 100;
		for (i = 0; i < sterrebeeldenObjects.length; i++) {
			sterrebeeldenObjects[i].scale = canvas.width / 1300;

		}
		init()
	})

// window.addEventListener('keyup', function(event){
// 	if(event.keyCode == 37){
// 		toggleNextReveal(0);

// 	}else if (event.keyCode == 39){
// 		toggleNextReveal(1);
// 	}
// })
window.addEventListener('mouseup', function (event) {
	toggleNextReveal(0);

})
//canvas button

function getMousePosition(x, y, width, height) {

}


//--------objects--------

//Sterrebeelden

beeldenList = [ //Elk punt wordt in volgorde verbonden. Een cijfer stelt een dead end voor en geeft aan dat de tekening hervat wordt op het punt dat het cijfer terug aangeeft
	rechthoek = [
		[0, 0],
		[0, 100],
		[100, 100],
		[100, 0],
		[200, 0],
		[200, 100], 3, [0, 0]
	],
	cepheus = [
		[20, 5],
		[0, 10],
		[10, 20],
		[100, 10],
		[180, 35],
		[90, 70],
		[25, 70],
		[10, 20], 2, [15, 100],
		[35, 115]
	],
	andromeda = [
		[0, 100],
		[50, 110],
		[120, 150],
		[130, 115],
		[125, 95],
		[80, 60],
		[40, 55], 5, [200, 180],
		[200, 150],
		[220, 105],
		[260, 70],
		[280, 45], 2, [240, 60], 7, [260, 190], 9, [200, 240],
		[180, 260]
	],
	cassiopeia = [
		[0, 0],
		[60, 100],
		[120, 95],
		[160, 180],
		[245, 105]
	]
]


var sterrebeeldenObjects = [
	new Sterrebeeld(canvas.width * 0.25, canvas.height * 0.55, beeldScale * 1.3, beeldenList[3], false),
	new Sterrebeeld(canvas.width * 0.7, canvas.height * 0.5, beeldScale * -1, beeldenList[2], false),
	new Sterrebeeld(canvas.width * 0.05, canvas.height * 0.15, beeldScale * 1.8, beeldenList[1], false)

]
var counter = 0;

function toggleNextReveal() {

	if (counter > sterrebeeldenObjects.length - 1) {
		revealNaam = true;
		revealText = false;

	}
	if (counter < sterrebeeldenObjects.length) {
		sterrebeeldenObjects[counter].reveal = true;
		counter += 1;
		textKies = counter;
		console.log(textKies)
	}


}

function Sterrebeeld(x, y, scale, puntenList, reveal) {
	this.x = x;
	this.y = y;
	this.scale = scale;
	this.puntenList = puntenList;
	this.puntenAantal = this.puntenList.length;

	this.opacity = 0;
	this.reveal = reveal;

	this.draw = function () {
		//Lijnen tekenen
		for (i = 0; i < this.puntenAantal - 1; i++) {
			if (typeof this.puntenList[i] == 'object') {
				c.beginPath()
				c.moveTo(this.x + this.puntenList[i][0] * this.scale, this.y + this.puntenList[i][1] * this.scale);
				c.lineTo(this.x + this.puntenList[i + 1][0] * this.scale, this.y + this.puntenList[i + 1][1] * this.scale);
				c.strokeStyle = this.kleur;
				c.lineWidth = 3;
				c.stroke();
			}
			if (typeof this.puntenList[i] == 'number') {
				c.beginPath()
				c.moveTo(this.x + this.puntenList[i - this.puntenList[i]][0] * this.scale, this.y + this.puntenList[i - this.puntenList[i]][1] * this.scale);
				c.lineTo(this.x + this.puntenList[i + 1][0] * this.scale, this.y + this.puntenList[i + 1][1] * this.scale);
				c.strokeStyle = this.kleur;
				c.lineWidth = 3;
				c.stroke();
			}
		}
		//Sterren tekenen
		for (i = 0; i < this.puntenAantal; i++) {
			if (typeof this.puntenList[i] == 'object') {
				c.beginPath();
				c.fillStyle = this.kleur;
				c.arc(this.x + this.puntenList[i][0] * this.scale, this.y + this.puntenList[i][1] * this.scale, 3, 0, Math.PI * 2, );
				c.fill();
			}
		}
	}

	this.update = function () {
		if (this.reveal == true && this.opacity < 1.0) {
			this.opacity += fadeSpeed;
		}
		this.opacityString = String(this.opacity).concat(')');
		this.kleur = 'rgba(255, 255, 255, '.concat(this.opacityString);

	}

}

//Sterren

function Star(x, y, radius, maxGlow, twinkleSpeed) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.kleur = 'white';

	this.maxGlow = maxGlow;
	this.twinkleGlow = maxGlow; //is eigenlijk de actuele glow, initieel gelijk aan maximale glow
	this.twinkleSpeed = twinkleSpeed
	this.twinklecounter = 0;

	this.opacity = 1.0;


	this.draw = function () {
		c.beginPath();
		c.fillStyle = this.kleur;

		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, );
		c.fill();
	}
}

//text
var revealNaam = false;
var opacityNaam = 0;
var kleurNaam = 'rgba(255, 255, 255, 0)';
var xoffset = 100;

function drawNaam() {
	c.fillStyle = kleurNaam;
	c.font = "100px Righteous";
	c.fillText("Hans Vertriest", canvas.width - 400 + xoffset, canvas.height / 2 + 150);
}

function updateNaam() {
	if (revealNaam == true && opacityNaam < 1.0) {
		opacityNaam += 0.01;
		if (xoffset > 0) {
			xoffset -= 5;
		}
	}
	var opacityString = String(opacityNaam).concat(')');
	kleurNaam = 'rgba(255, 255, 255, '.concat(opacityString);
}



var revealText = true;
var opacityText = 1;
var kleurText = 'rgba(255, 255, 255, 1.0)';
text1 = 'Click the stars.'
text2 = 'Keep clicking.'
text3 = 'Come on, keep going.'
text4 = 'Don\'t stop now...'
textKies = 0;

function drawText() {
	c.fillStyle = kleurText;
	c.font = "35px Open Sans Condensed";
	if (textKies == 0) {
		c.textAlign = "center";
		c.fillText(text1, canvas.width / 2, canvas.height / 2);

	} else if (textKies == 1) {
		c.textAlign = "center";
		c.fillText(text2, canvas.width / 2, canvas.height / 2);
	} else if (textKies == 2) {
		c.textAlign = "center";
		c.fillText(text3, canvas.width / 2, canvas.height / 2);
	} else if (textKies == 3) {
		c.textAlign = "center";
		c.fillText(text4, canvas.width / 2, canvas.height / 2);
	}


}

function updateText() {

	if (revealText == false && opacityText > 0) {
		opacityText -= fadeSpeed;
		console.log(opacityText)
	}
	var opacityString = String(opacityText).concat(')');
	kleurText = 'rgba(255, 255, 255, '.concat(opacityString);
	console.log("d")
}



//--------Standaard functies--------

function animation() {
	requestAnimationFrame(animation);
	var grd = c.createLinearGradient(0, 0, 0, (canvas.height * 75) / 100);
	grd.addColorStop(0, '#00001a');
	grd.addColorStop(1, '#003333');
	//c.fillStyle = '#00001a';
	c.fillStyle = grd;

	c.fillRect(0, 0, innerWidth, innerHeight);
	for (i = 0; i < totalSmallStars; i++) {
		smallStarList[i].draw();
	}
	for (i = 0; i < totalBigStars; i++) {
		bigStarList[i].draw();
	}
	for (a = 0; a < sterrebeeldenObjects.length; a++) {
		sterrebeeldenObjects[a].draw();
		sterrebeeldenObjects[a].update();
	}

	//text
	if (revealNaam == true) {
		updateNaam();
		drawNaam();
	}

	updateText();
	if (revealText == true) {
		drawText();

	}

}

function init() {


	//genereer kleine sterren
	for (i = 0; i < totalSmallStars; i++) {
		var x = Math.random() * (canvas.width);
		var y = Math.random() * (canvas.height);
		var radius = Math.random() * maxSmallStarRadius + 0.1;
		var twinkleSpeed = Math.random() * maxSmallTwinkleSpeed + 30;
		smallStarList[i] = new Star(x, y, radius, smallStarGlow, twinkleSpeed);
	}
	//genereer grote sterren
	for (i = 0; i < totalBigStars; i++) {
		var x = Math.random() * (canvas.width);
		var y = Math.random() * (canvas.height);
		var radius = Math.random() * (maxBigStarRadius - maxSmallStarRadius) + maxBigStarRadius + 0.1;
		var twinkleSpeed = Math.random() * (maxBigTwinkleSpeed - maxSmallTwinkleSpeed) + maxBigTwinkleSpeed;
		/*bigStarList[i] = new Star(x, y, radius, bigStarGlow, twinkleSpeed );*/
		bigStarList[i] = new Star(x, y, radius, bigStarGlow, twinkleSpeed);
	}


}


//--------initialisatie--------

init();
animation();