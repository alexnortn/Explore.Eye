// Eyewire Bumper Animation
// Alex Norton
// http://eyewire.org






// Running the sketch in instance mode, don't forget to preface all P5 methods with { p }
var bump = function (p) {
// Global Variables

	var E, E2;
	var dot, dot2;
	var angle;

	p.preload = function() {
		E = p.loadImage("assets/E.png");
		E2 = p.loadImage("assets/E2.png");
		dot = p.loadImage("assets/dot.png");
		dot2 = p.loadImage("assets/dot.png");
	}

	p.setup = function() {
		p.createCanvas(window.innerWidth, window.innerHeight);
		p.frameRate(30);
		angle = 0;
	}

	p.draw = function () {
		p.background(27,39,49);
		// Assemble Logo!

		// Rotate E
		p.push();

			p.tint(255, 125);
			
			p.translate(p.width/2, p.height/2);
			// p.rotate(p.PI/4);	
			p.scale(10,10); 
			p.translate(-41,-58);
			p.scale(0.15,0.15);
				// Top Dot
				p.push();
					p.translate(280, 75);
					p.image(dot, 0, 0);
				p.pop();

				// Bottom Dot
				p.push();
					p.translate(190, 593);
					p.image(dot2, 0, 0);
				p.pop();

				
				// Top E
				p.image(E, 100, 100);

				// Bottom E
				p.push();
					p.translate(200, 200);
					p.image(E2, 0, 0);
				p.pop();
		p.pop();

		p.push();
			p.fill(255);
			p.noStroke();
			p.translate(p.width/2, p.height/2);
			p.ellipse(0,0,10,10);
		p.pop();

		p.stroke(255, 25);
		p.strokeWeight(1);
		p.line(p.width/2, 0, p.width/2, p.height);
		p.line(0, p.height/2, p.width, p.height/2);


		// var wind = createVector(0.01, 0);
		// var gravity = createVector(0, 0.1);
		// m.applyForce(wind);
		// m.applyForce(gravity);

		// m.update();
		// m.display();
		// m.checkEdges();

		// angle += 0.05;

	}

}

// Instantiate the entire P5 sketch
new p5(bump);




