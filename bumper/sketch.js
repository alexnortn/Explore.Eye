// Eyewire Bumper Animation
// Alex Norton
// http://eyewire.org






// Running the sketch in instance mode, don't forget to preface all P5 methods with { p }
var bump = function (p) {
// Global Variables

	var E, E2;
	var dot, dot2;

	// Animation constants || should I return from the animation (yes)  
	var a_e_s; // Animate Es scale
	var a_e_r; // Animate Es rotation


	p.preload = function() {
		E = p.loadImage("assets/E.png");
		E2 = p.loadImage("assets/E2.png");
		dot = p.loadImage("assets/dot.png");
		dot2 = p.loadImage("assets/dot.png");
	}

	p.setup = function() {
		p.createCanvas(window.innerWidth, window.innerHeight);
		p.frameRate(30);

		// Spring animation object for Es scale
		a_e_s = new Ani_scale_e ({
			start: 0, 		// animation starting value
			end: 1, 		// value to increment towards
			msec: 2500, 	// Number of update steps : microseconds --> 1000 / second | 2.5sec
			easing: springFactory(0.15, 12), // Default
		});

		// Spring animation object for Es rotate
		a_e_r = new Ani_scale_e ({
			start: 0, 		// animation starting value
			end: p.PI/4, 		// value to increment towards
			msec: 2500, 	// Number of update steps : microseconds --> 1000 / second | 2.5sec
			easing: springFactory(0.15, 12), // Default
		});
	}

	p.draw = function () {
		p.background(27,39,49);

		// Draw E
		draw_e();

		if (p.frameCount == 120) {
			a_e_s.animate();
		}

		if (p.frameCount == 150) {
			a_e_r.animate();
		}

	}

	// Draw grid
	debug = function() {

		p.stroke(255, 25);
		p.strokeWeight(1);
		p.line(p.width/2, 0, p.width/2, p.height);
		p.line(0, p.height/2, p.width, p.height/2);
		// Half Lines
		p.line(p.width/2 -300, 0, p.width/2 -300, p.height);
		p.line(p.width/2 +300, 0, p.width/2 +300, p.height);
		// Quarter Lines
		p.line(p.width/2 -119, 0, p.width/2 -119, p.height);
		p.line(p.width/2 +119, 0, p.width/2 +119, p.height);
		p.line(p.width/2 + 200, 0, p.width/2 + 200, p.height);
		p.line(p.width/2 - 200, 0, p.width/2 - 200, p.height);
		// Latitude
		p.line(0, p.height/2 + 200, p.width, p.height/2 + 200);
		p.line(0, p.height/2 - 200, p.width, p.height/2 - 200);
		p.line(0, p.height/2 + 300, p.width, p.height/2 + 300);
		p.line(0, p.height/2 - 300, p.width, p.height/2 - 300);
		p.line(0, p.height/2 + 387, p.width, p.height/2 + 387);
		p.line(0, p.height/2 - 387, p.width, p.height/2 - 387);

	}

	// Draw basic E logo in center of screen
	// Consider applying a transformation stack on top of this
	draw_e = function() {

		// Assemble Logo!

		// Rotate E
		p.push();

			p.tint(255, 255); // Opacity (255)
			
			p.translate(p.width/2, p.height/2);
			//
			// All rotations must occur here!!!!
			//
			p.rotate(a_e_r.value);	
			console.log(a_e_s.value);
			p.scale(a_e_s.value, a_e_s.value); 
			p.translate(-41.25,-57.5);
			p.scale(0.15,0.15);
				// Top Dot
				p.push();
					p.translate(278, 75);
					p.image(dot, 0, 0);
				p.pop();

				// Bottom Dot
				p.push();
					p.translate(175, 593);
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
		p.pop();

	}


	// Helper Function
	function clamp (x, min, max) {
	    return Math.min(Math.max(x, min), max);
	}


	// Generic easing function --> super abstract simply returns a t
	function springFactory (zeta, k) {
		if (zeta < 0 || zeta >= 1) {
			throw new Error("Parameter 1 (zeta) must be in range [0, 1). Given: " + zeta);
		}

		if (Math.floor(k) !== k) {
			throw new Error("Parameter 2 (k) must be an integer. Given: " + k);
		}

		var odd_number = 1 + 2 * k;

		var omega = odd_number / 4 / Math.sqrt(1 - zeta * zeta); // solution set for x(1) = 0
		omega *= 2 * Math.PI; // normalize sinusoid period to 0..1

		return function (t) {
			t = clamp(t, 0, 1);
			return 1 - Math.exp(-t * zeta * omega) * Math.cos(Math.sqrt(1 - zeta * zeta) * omega * t);
		};
	}

	// OOP --> Generic animation function
	// Accepts any range and returns a springified value c:
	function Ani_scale_e(args) {
		args = args || {};

	  	var easing = args.easing || function (t) { return t }; // default to linear easing
	  	var start_pos = args.start || 0;
	  	var end_pos = args.end || 1;
	  	var msec = args.msec || 1000; // default to 1000msec --> 1s

	  	var start,
	  		delta = end_pos - start_pos; // displacement


	  	// Value to be returned
	  	this.value = 0;
	  	console.log(this);

	  	// Global (local) reference to 'this'
	  	var _this = this;
	  	

		// performance.now is guaranteed to increase and gives sub-millisecond resolution
		// Date.now is susceptible to system clock changes and gives some number of milliseconds resolution
		var start = window.performance.now(), 
			delta = end_pos - start_pos; // displacement

		function frame() {
			console.log(_this);
			var now = window.performance.now();
			var t = (now - start) / msec; // normalize to 0..1

			if (t >= 1) { // if animation complete or running over
				_this.value = end_pos; // ensure the animation terminates in the specified state
			  	return;
			}

			var proportion = easing(t); // Call upon the strange magic of the spring factory
			_this.value = start_pos + proportion * delta; 	// delta is our multiplier | this decides our current position relative to starting position
															// update your animation based on this value
															// trig functions are naturally really excited about this,
															// Can I make the whole thing less imperitive? --> Stateless?
			// console.log("object" + _this.value);
			requestAnimationFrame(frame); // next frame!

		}

		this.animate = function() {
			start = window.performance.now();
			requestAnimationFrame(frame); // you can use setInterval, but this will give a smoother animation --> Call it the first time and it loops forever until return
		}

	}

}

// Instantiate the entire P5 sketch
new p5(bump);




