// Eyewire Bumper Animation
// Alex Norton
// http://eyewire.org






// Running the sketch in instance mode, don't forget to preface all P5 methods with { p }
var bump = function (p) {
// Global Variables

	var E, E2;
	var dot, dot2;
	var angle;

	// Animation constants || should I return from the animation (yes)  
	var a_e_s, // Animate scale Es 
		a_d_s, // Animate scale dots
		a_ed_r, // Animate rotation Es + Dots 
		a_d_r; // Animate rotation dots 


	p.preload = function() {
		// Load image assets
		E = p.loadImage("assets/E.png");
		E2 = p.loadImage("assets/E2.png");
		dot = p.loadImage("assets/dot.png");
		dot2 = p.loadImage("assets/dot.png");
	}

	p.setup = function() {
		p.createCanvas(window.innerWidth, window.innerHeight);
		p.frameRate(30);

		angle = 0;

		// Spring animation object for Es scale
		a_e_s = new Ani_scale_e ({
			start: 0, 		// animation starting value
			end: 1, 		// value to increment towards
			msec: 2500, 	// Number of update steps : microseconds --> 1000 / second | 2.5sec
			easing: springFactory(0.15, 12), // Default
		});

		// Spring animation object for dots scale
		a_d_s = new Ani_scale_e ({
			start: 0, 		// animation starting value
			end: 1, 		// value to increment towards
			msec: 2500, 	// Number of update steps : microseconds --> 1000 / second | 2.5sec
			easing: springFactory(0.15, 12), // Default
		});

		// Spring animation object for Dots rotate
		a_d_s = new Ani_scale_e ({
			start: 0, 		// animation starting value
			end: p.PI/4, 		// value to increment towards
			msec: 2500, 	// Number of update steps : microseconds --> 1000 / second | 2.5sec
			easing: springFactory(0.15, 12), // Default
		});

		// Spring animation object for Es + Dots rotate
		a_ed_r = new Ani_scale_e ({
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

		if (p.frameCount == 130) {
			a_d_s.animate();
		}

		if (p.frameCount == 150) {
			// a_e_r.animate();
		}

		debug();

	}

	// Draw grid
	debug = function() {

		p.stroke(255, 25);
		p.strokeWeight(1);

		// Make a simple grid
		var horz,
			vert;
		var num_lines = 10;
		for (var i = 0; i < num_lines; i++) {
			horz = p.width / num_lines;
			vert = p.height / num_lines;
			p.line(horz  * i, 0, horz * i, p.height);
			p.line(0, vert * i, p.width, vert * i);
		}

	}

	// Draw basic E logo in center of screen
	// Consider applying a transformation stack on top of this
	draw_e = function() {

		// Assemble Logo!

		// Rotate E
		p.push();

			p.tint(255, 100); // Opacity (255)
			
			p.translate(p.width/2, p.height/2);
			//
			// All rotations must occur here!!!!
			//
			p.rotate(0);	
			p.scale(10, 10); 
			p.translate(-41.25,-42.5);
			p.scale(0.15,0.15);

			// Polar Coordinates
			// For Dots
				var r = 265;						// Origin Offset  	{start: 300, end: 265}
				angle = p.radians(77);				// Angle Offset		{start: 0, end: 77}
				x = p.cos(angle) * r;				// Multiply r * -1 for other Dot
				y = p.sin(angle) * r;

					// Top Dot
					p.push();
						p.scale(1, 1);
						// p.translate(278, 75);  	// Dot final position
						p.translate(x,y);
						p.translate(276,283); 		// Center on Es
						p.image(dot, -50, -50); 	// Center around origin
						// p.ellipse(-1,1,2,2);		// Debugging Center pt
					p.pop();

					// Bottom Dot
					p.push();
						p.scale(1, 1);
						// p.translate(175, 593);  	// Dot final position
						p.translate(-x,-y);
						p.translate(276,283); 		// Center on Es
						p.image(dot2, -50, -50); 	// Center around origin
						// p.ellipse(-1,1,2,2);		// Debugging Center pt
					p.pop();

				
				// Bottom E
				p.image(E, 100, 100);

				// Top E
				p.push();
					p.translate(200, 0);
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

	//  Definition for Ease In Out timing function
	function easeInOut (t) {
		t = clamp(t, 0, 1);

		var a = -1.067,
			b = 1.6,
			c = 0.467;

		return t * (t * ((a * t) + b) + c);
	};

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




