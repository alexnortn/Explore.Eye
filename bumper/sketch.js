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

		// Draw E
		draw_e();

		angle += 0.05;

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
			p.rotate(p.PI/4);	
			// p.scale(10,10); 
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

	/* Example animation function 
	 * 
	 * Interpolate between a start and end position.
	 *
	 * obj.x represents a position parameter (e.g. 12.2)
	 * end_pos is the value obj.x will have at the end of the animation
	 * msec is the number of milliseconds we want to run the animation for
	 * easing is a timing function that accepts a number between 0 to 1 
	 *    and returns the proportion of the interpolation between start and end to move the object to. 
	 * 
	 * Returns: void (performs animation as a side effect)
	 */
	animate_scale_e = function(args) {
		args = args || {};

	  	var easing = args.easing || function (t) { return t }; // default to linear easing
	  	var prop = args.prop;
	  	var start_pos = args.start || 0;
	  	var end_pos = args.end || 1;
	  	var timer = args.frames

		var start_pos = parseInt(style.top.replace("%", ""), 10),
			end_pos = args.end !== undefined ? args.end : start_pos,
	  		msec = args.msec || 1000;

		// performance.now is guaranteed to increase and gives sub-millisecond resolution
		// Date.now is susceptible to system clock changes and gives some number of milliseconds resolution
		var start = window.performance.now(), 
		  delta = end_pos - start_pos; // displacement

		function frame () {
			var now = window.performance.now();
			var t = (now - start) / msec; // normalize to 0..1

			if (t >= 1) { // if animation complete or running over
			  obj.style.top = end_pos + "%"; // ensure the animation terminates in the specified state
			  return;
			}

			var proportion = easing(t);
			obj.style.top = (start_pos + proportion * delta) + "%"; // delta is our multiplier | this decides our current position relative to starting position
																	// update your animation based on this value
																	// trig functions are naturally really excited about this,
																	// Can I make the whole thing less imperitive? --> Stateless?

			requestAnimationFrame(frame); // next frame!
		}

		requestAnimationFrame(frame); // you can use setInterval, but this will give a smoother animation --> Call it the first time and it loops forever until return
	}

	function clamp (x, min, max) {
	    return Math.min(Math.max(x, min), max);
	}

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


	// Animate E scale --> Call
	animate_scale_e = function() {
		// Call animation
		scale({
			prop: _scale,   // value to increment
			start: 0, 		// animation starting value
			end: 1, 		// value to increment towards
			frames: 2500, 	// Number of update steps (30 frames == 1 sec: 60 frames == 2 sec: 75 frames == 2.5 sec)
			easing: springFactory(0.15, 12), // Default
		});
	};

}

// Instantiate the entire P5 sketch
new p5(bump);




