// Eyewire Bumper Animation
// Alex Norton
// http://eyewire.org






// Running the sketch in instance mode, don't forget to preface all P5 methods with { p }
var bump = function (p) {
// Global Variables

	var E, E2;
	var dot, dot2;

	// Animation constants || should I return from the animation (yes)  
	var a_e_s, 	// Animate scale Es 
		a_d_s, 	// Animate scale dots
		a_d_r, 	// Animate rotation dots 
		a_d_d,	// Animate diameter dots
		a_ed_r, // Animate rotation Es + Dots 
		global_animator; 	//Global animation controller!


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

		// Global Animator Returns following animations in linear step
		global_animator = new Animator ({
			start: 0, 		// animation starting value
			end: 1, 		// value to increment towards
			ratio: 1,		// ratio to total animation
			msec: 5000, 	// Number of update steps : microseconds --> 1000 / second | 2.5sec
			order: 0,		// Order to Call		
			easing: linear(), // Linear Timing Function
		});

		// Spring animation object for Es scale
		a_e_s = new Animator ({
			start: 0, 		// animation starting value
			end: 1, 		// value to increment towards
			ratio: 0.25,	// ratio to total animation
			msec: 500, 		// Number of update steps : microseconds --> 1000 / second | 2.5sec
			order: 1,		// Order to Call
			easing: springFactory(0.15, 12), // Spring Timing Function
		});

		// Spring animation object for dots scale
		a_d_s = new Animator ({
			start: 0, 		// animation starting value
			end: 1, 		// value to increment towards
			ratio: 0.25,	// ratio to total animation
			msec: 500, 		// Number of update steps : microseconds --> 1000 / second | 2.5sec
			order: 2,		// Order to Call
			easing: springFactory(0.15, 12), // Spring Timing Function
		});

		// Spring animation object for Dots rotate
		a_d_r = new Animator ({
			start: 0, 		// animation starting value
			end: 77, 		// value to increment towards
			ratio: 0.25,	// ratio to total animation
			msec: 500, 		// Number of update steps : microseconds --> 1000 / second | 2.5sec
			order: 3,		// Order to Call
			easing: easeInOut(), // Cubic Timing Function
		});

		// Spring animation object for Dots radius
		a_d_d = new Animator ({
			start: 300, 	// animation starting value
			end: 265, 		// value to increment towards
			ratio: 0.25,	// ratio to total animation
			msec: 500, 		// Number of update steps : microseconds --> 1000 / second | 2.5sec
			order: 3,		// Order to Call
			easing: easeInOut(), // Cubic Timing Function
		});

		// Spring animation object for Es + Dots rotate
		a_ed_r = new Animator ({
			start: 0, 		// animation starting value
			end: 45, 		// value to increment towards
			ratio: 0.25,	// ratio to total animation
			msec: 500, 		// Number of update steps : microseconds --> 1000 / second | 2.5sec
			order: 4,		// Order to Call
			easing: springFactory(0.15, 7), // Spring Timing Function
		});

	}

	// Consider this Update
	p.draw = function () {
		p.background(27,39,49);

		// Render Graphics
		render();

		// Animation Controller
		step();

		// Draw Grid
		debug();

	}

	// Global Animator Controls
	// Step through animations in given order
	step = function() {

		// Kick off animation
		if(!global_animator.started) {
			global_animator.animate();
			console.log("global");
		}

		// Animate the Es to Scale
		if (global_animator.value >= a_e_s.ratio * a_e_s.order && !a_e_s.started) {
			console.log(global_animator.value);
			a_e_s.msec = global_animator.msec * a_e_s.ratio;
			// console.log("Es scale");
			// console.log(a_e_s.delta);
			a_e_s.animate();
		}

		// // Animate the Dots to Scale
		if (global_animator.value >= a_d_s.ratio * a_d_s.order && !a_d_s.started) {
			a_d_s.msec = global_animator.msec * a_d_s.ratio;
			console.log("Dots scale");
			a_d_s.animate();
		}
		
		// // Animate the Dots to Rotate
		if (global_animator.value >= a_d_r.ratio * a_d_r.order && !a_d_r.started) {
			a_d_r.msec = global_animator.msec * a_d_r.ratio;
			console.log("Dots rotate");
			a_d_r.animate();
		}

		// // Animate the Dots to Change Diameter
		if (global_animator.value >= a_d_d.ratio * a_d_d.order && !a_d_d.started) {
			a_d_d.msec = global_animator.msec * a_d_d.ratio;
			console.log("Dots diamter");
			a_d_d.animate();
		}

		// // Animate both the Dots & Es to Rotate
		if (global_animator.value >= a_ed_r.ratio * a_ed_r.order && !a_ed_r.started) {
			a_ed_r.msec = global_animator.msec * a_ed_r.ratio;
			console.log("Both rotate");
			a_ed_r.animate();
		}

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
	render = function() {

		// Assemble Logo!

		// Rotate E
		p.push();

			p.tint(255, 100); // Opacity (255)
			
			p.translate(p.width/2, p.height/2);
			p.rotate(p.radians(a_ed_r.value));					// All rotations must occur here!!!
			p.scale(5,5);

			// For Dots
			p.push();

				p.scale(a_d_s.value, a_d_s.value); 						// Global scale
				p.translate(-41.25,-42.65); 		// Center offset
				p.scale(0.15,0.15);

				// Polar Coordinates
				var r = a_d_d.value;				// Origin Offset  	{start: 300, end: 265}
				angle = p.radians(a_d_r.value);		// Angle Offset		{start: 0, end: 77}
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

			p.pop();

			// For Es
			p.push();

				p.scale(a_e_s.value, a_e_s.value); 						// Global scale
				p.translate(-41.25,-42.65); 		// Center offset
				p.scale(0.15,0.15);

				
				// Bottom E
				p.image(E, 100, 100);

				// Top E
				p.push();
					p.translate(200, 0);
					p.image(E2, 0, 0);
				p.pop();

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
		t = clamp(t, 0, 1) || 0;

		var a = -1.067,
			b = 1.6,
			c = 0.467;

		return t * (t * ((a * t) + b) + c);
	};

	// Simple linear timing function
	// Will use this to progress the entire animation!
	function linear (t) { return t };

	// OOP --> Generic animation function
	// Accepts any range and returns a springified value c:
	function Animator(args) {
		args = args || {};

	  	this.easing = args.easing || function (t) { return t }; // default to linear easing
	  	this.start_pos = args.start || 0;
	  	this.end_pos = args.end || 1;
	  	this.ratio = args.ratio || 0.25; // ratio to total animation --> normalize to 1
	  	this.msec = args.msec || 1000; // default to 1000msec --> 1s
	  	this.order = args.order || 1;

	  	// Called Flag
	  	this.started = false;

	  	// Value to be returned
	  	this.value = this.start_pos;

	  	// Global (local) reference to 'this'
	  	var _this = this;
	  	

		// performance.now is guaranteed to increase and gives sub-millisecond resolution
		// Date.now is susceptible to system clock changes and gives some number of milliseconds resolution
		_this.start = window.performance.now(); 
		var delta = _this.end_pos - _this.start_pos; // displacement

		function frame() {
			// console.log(_this);
			var now = window.performance.now();
			var t = (now - _this.start) / _this.msec; // normalize to 0..1

			if (t >= 1) { // if animation complete or running over
				_this.value = _this.end_pos; // ensure the animation terminates in the specified state
			  	return;
			}

			var proportion = _this.easing(t); // Call upon the strange magic of your timing function
			_this.value = _this.start_pos + proportion * delta; 	// delta is our multiplier | this decides our current position relative to starting position
															// update your animation based on this value
															// trig functions are naturally really excited about this,
															// Can I make the whole thing less imperitive? --> Stateless?

			requestAnimationFrame(frame); // next frame!

		}

		this.animate = function() {
			_this.started = true;
			_this.start = window.performance.now();
			requestAnimationFrame(frame); // you can use setInterval, but this will give a smoother animation --> Call it the first time and it loops forever until return
		}

	}

}

// Instantiate the entire P5 sketch
new p5(bump);




