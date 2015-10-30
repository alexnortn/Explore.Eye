// Growing Neurons
// Alex Norton :: 2015
// https://github.com/alexnortn/Explore.Eye

// Recursive Neuron (w/ ArrayList)

// A class for extending a Neuron with Sum Weighted Forces across nodes
	// Contructor: 
		//  P5.Vector: 	position
		//	P5.Vector: 	velocity 
		// 	Float: 		neuron_timer
		//  Integer: 	depth --> Current depth
		// 	Integer:  	max_depth
		//  P5, 	p --> instance
	// 
function Node (args) {
	args = args || {};

	// Private arguments from constructor
	var p = args.p;

	// Public P5.Vector objects
	this.start = args.position.copy() || p.createVector();
	this.position = args.position.copy() || p.createVector();
	this.velocity = args.velocity.copy() || p.createVector();
	
	// Public floats
	this.neuron_timer = args.neuron_timer || 0;
	this.max_depth = args.max_depth || 7;
	this.depth = args.depth || 0;
	
	// Not in constructor
	this.acceleration = p.createVector(0,0);
	this.timer = this.neuron_timer;
	
	// Setup public arrays for children Nodes and Adjacency List
	this.children = [];
	this.adj_list = [];
	
	// Public array of vectors to contain coordinates for Catmull Rom paths
	this.curve_pts = []; // 4 pts
	
	// Node Object :: Can only ever have a single parent
	this.parent == null;

	// Public Booleans
	this.leaf = true;
	this.size = false;
	this.start_point = false;
	this.dw = false;

	// Floats
	var   inimult,     // Initial offset multiplier
		  sepmult;     // Separation multiplier

	// Private variables
	var wandertheta = 0;
	var wan_const = 1.0;
	var maxspeed = 1.5;       // Default 2
	var maxforce = p.random(0.8,1);    // Default 0.05

	// Increment for each instantiation at a branch event
	this.depth++;

	// Ensures that the definition of leaf is fresh
	this.isLeaf = function () {
		var _this = this;
		return _this.children.length === 0;
	};

	// var n :: Node()
	this.addChild = function(n) {
		var _this = this;
		n.parent = _this;
		_this.children.push(n);
	} 

	// var n :: Node()
	this.addParent = function(n) {
		var _this = this;
		n.addChild(_this);
	}

	// Set curve points
	this.pt_0 = function() {
		var _this = this;
		var p_0 = p.createVector();
		var isAlone =  _this.parent.parent instanceof Node;
		if (!isAlone) {
			p_0 = _this.start.copy();       
			return p_0;
		} 
		else {
			return p_0.set(_this.parent.start.x,_this.parent.start.y);
		}
	}

	this.pt_1 = function() {
		var _this = this;
		var p_1 = p.createVector();
		return p_1.set(_this.start.x, _this.start.y);
	}

	this.pt_2 = function() {
		var _this = this;
		var p_2 = p.createVector();
		return p_2.set(_this.position.x, _this.position.y);
	}

	this.pt_3 = function() {
		var _this = this;
		var p_3 = p.createVector();
		if (_this.children.length == 1) {
			return p_3.set(_this.children[0].position.x,_this.children[0].position.y);
		} 
		else if (this.children.length > 1) {
			for (var i = 0; i < _this.children.length; i++) {
				p_3.add(_this.children[i].position);
			}
			p_3.div(_this.children.length);
			return p_3;
		} 
		else { // While we're growing
			return p_3.set(_this.position.x,_this.position.y);
		}

	}

	this.wander = function() {
		var _this = this;
		var wanderR = 25;         						// Radius for our "wander circle"
		var wanderD = 80;         						// Distance for our "wander circle"
		var change = 0.3;
		
		wandertheta += p.random(-change,change);   // Randomly change wander theta

		// Now we have to calculate the new position to steer towards on the wander circle
		var circleloc = _this.velocity.copy();    		// Start with velocity
			circleloc.normalize();            			// Normalize to get heading
			circleloc.mult(wanderD);          			// Multiply by distance
			circleloc.add(_this.position);               // Make it relative to boid's position

		var h = _this.velocity.heading();        		// We need to know the heading to offset wandertheta

		var circleOffSet = p.createVector(
			wanderR * p.cos(wandertheta + h), 
			wanderR * p.sin(wandertheta + h)
		);
		var target = p5.Vector.add(circleloc, circleOffSet);

		// Render wandering circle, etc. 
		if (_this.dw) _this.drawWanderStuff(_this.position, circleloc, target, wanderR);

		// Returns call to seek() and a vector object
		return _this.seek(target);

	}

	// A method just to draw the circle associated with wandering
	 this.drawWanderStuff = function(loc,circle,target,rad) {
		p.push();
			p.stroke(100); 
			p.noFill();
			p.ellipseMode(p.CENTER);
			// Outter Circle
			p.ellipse(circle.x,circle.y,rad*2,rad*2); 
			// Inner Circle
			p.ellipse(target.x,target.y,4,4);
			// Line At target location
			p.line(loc.x,loc.y,circle.x,circle.y);
			// Line from center of Circle to Target
			p.line(circle.x,circle.y,target.x,target.y);
		p.pop();
	}  

	// A method that calculates and applies a steering force towards a target
	// STEER = DESIRED MINUS VELOCITY
	// Consider using to attract towards another cell or synapse
	// Accepts P5.Vector for argument
	this.seek = function(target) {
		var _this = this;
		var _target = target.copy();
		
		_target.sub(_this.position);  // A vector pointing from the position to the _target
		
		// float angle = degrees(desired.heading());
		// inimult =  map(angle,0,180,0,5);  

		// Normalize _target and scale to maximum speed
		_target.normalize();
		_target.mult(maxspeed);
		// Steering = Desired minus Velocity
		_target.sub(_this.velocity);
		_target.limit(maxforce);  // Limit to maximum steering force

		return _target;
	}

	// Separation
	// Method checks for nearby nodes and steers away
	// Accepts Array as input
	this.separate = function(nodes) {
		var _this = this;
		var desiredseparation = 25.0;
		var steer = p.createVector(0,0);
		var count = 0;
;		// For every node in the system that is a leaf, check if it's too close
		nodes.forEach(function(other) {
		  	// var d = this.position.dist(other.position); // Alternative implementation
			var d = p5.Vector.dist(_this.position, other.position);
			// If the distance is greater than 0 and less than an arbitrary amount (0 when you are yosurself)
			if ((d > 0) && (d < desiredseparation)) {
				// Calculate vector pointing away from neighbor
				var diff = p5.Vector.sub(_this.position,other.position);
					diff.normalize();
					diff.div(d*d);        				// Weight by distance
				sepmult = p.map((1/(d*d)),0,1,0,5);     // Proportional to Inverse Distance Squared
				steer.add(diff);
				count++;             					// Keep track of how many
			}
		});
		// Average -- divide by how many
		if (count > 0) {
			steer.div(count);
		}
		// As long as the vector is greater than 0
		// Using magSq() --> to avoid square root
		if (steer.magSq() > 0) {
			// Implement Reynolds: Steering = Desired - Velocity
			steer.normalize();
			steer.mult(maxspeed);
			steer.sub(_this.velocity);
			steer.limit(maxforce);
		}

		return steer;
	}

	// Simple method to sum forces
	// Accepts P5.Vector
	this.applyForce = function(force) {
		var _this = this;
		_this.acceleration.add(force);
	}

	// We accumulate a new acceleration each time based on three rules
	// Accepts an Array of Node objects
	this.expand = function(nodes) {
		var _this = this;
		var sep = _this.separate(nodes);      				// Separation
		var ini = _this.seek(_this.findRoot(_this)).mult(-1); 	// Root Node (multiply by -1 to repel)
		var wan = _this.wander();             				// Wander

		// Carefully weight these forces
		sep.mult(1);
		ini.mult(1.5);
		wan.mult(wan_const);

		// Add the force vectors to acceleration
		_this.applyForce(sep);
		_this.applyForce(ini);
		_this.applyForce(wan);
	}

	// Method to update position
	this.update = function() {
		var _this = this;
		// Update velocity
		_this.velocity.add(_this.acceleration);
		// Limit speed
		_this.velocity.limit(maxspeed);
		_this.position.add(_this.velocity);
		// Reset accelertion to 0 each cycle
		_this.acceleration.mult(0);
	}

	// Draw a dot at position
	this.render = function() {
		var _this = this;
		// Basic Fractal Lines
		p.stroke(200);
		p.noFill();
		// Array to store curve points
		// var pts = [
		// 	p.createVector(_this.pt_0().x, _this.pt_0().y),
		// 	p.createVector(_this.pt_1().x, _this.pt_1().y),
		// 	p.createVector(_this.pt_2().x, _this.pt_2().y),
		// 	p.createVector(_this.pt_3().x, _this.pt_3().y)
		// ];
			
		// p.line(_this.pt_1().x, _this.pt_1().y, _this.pt_2().x, _this.pt_2().y);
		// Render Curves
		p.curve(
			_this.pt_0().x, _this.pt_0().y,
			_this.pt_1().x, _this.pt_1().y,
			_this.pt_2().x, _this.pt_2().y,
			_this.pt_3().x, _this.pt_3().y
		);

		// p.curve(
		// 	pts[0].x, pts[0].y,
		// 	pts[1].x, pts[1].y,
		// 	pts[2].x, pts[2].y,
		// 	pts[3].x, pts[3].y
		// );

		// For fun:
		// pts = pts
		// 	.map(function (v) {
		// 		return [v.x, v.y]
		// 	})
		// 	.reduce(function (arr, vec) {
		// 		arr.push(vec[0], vec[1])
		// 		return arr;
		// 	}, [])

		// p.curve.apply(p, pts);

		// Render Path Home
		if (_this.size) {
			p.noStroke();
			p.fill(200,0,0);
			// p.ellipse(_this.start.x,_this.start.y,5,5);
			// p.ellipse(_this.position.x, _this.position.y, 5, 5);
		}

		if (_this.start_point) {
			p.noStroke();
			p.fill(200,0,0);
			// p.ellipse(_this.position.x, _this.position.y, 5, 5);
		}
		// Draw Soma
		p.push();
			p.fill(200);
			if (_this.depth == 2) p.ellipse(_this.start.x,_this.start.y,15,15);
		p.pop();
		// Debug Neighborhood
		p.push();
			// p.noStroke();
			// p.fill(255,10);
			// p.ellipse(_this.position.x,_this.position.y,50,50);
			// p.fill(255,255);
		p.pop();
	}

	// Accepts an Array of Node Objects
	this.run = function(nodes) {
		var _this = this;
		if (_this.isGrowing()) {
			_this.tick();
			_this.expand(nodes);
			_this.update();
			// Display Wandering Debug

			// Make leaves go crazy on final level
			if (_this.depth == (_this.max_depth - 2)) {
				wan_const = 3;
			}
		} else {
			_this.dw = false;
		}
	}

	// Recurse through nodes to root
	// Accepts Node object
	// Returns p5.Vector object
	this.findRoot = function(n) {
		var _this = this;
		if (n.parent == null) {
			return n.position;
		}
		else {
			return _this.findRoot(n.parent);
		}
	}

	// Calc T(--)
	this.sub_t = function (mxd) {
		var tt = mxd / 1.5;
		return tt;
	}

	// Did the timer run out?
	// Returns boolean --> Growing?
	this.tick = function () {
		var _this = this;
		if ((_this.depth == 2) || (_this.depth == 3)) {
			_this.timer -= p.round(p.random(2,_this.sub_t(_this.max_depth)));;
		} 
		else {
			_this.timer--;
		}
	}

	this.isGrowing = function() {
		var _this = this;
		if (_this.timer >= 0) {
			// Set branch point
			return true;
		} 

		return false;
	}

	// Create a new dendrite at the current position, but change direction by a given angle
	// Returns a new Node object
	this.branch = function(angle) {
		var _this = this;
		// What is my current heading
		var theta = _this.velocity.heading();
		// What is my current speed
		// Can't see how this could be faster
		var mag = _this.velocity.mag();
		// Turn me
		theta += p.radians(angle);
		// Polar coordinates to cartesian!!
		var newvel = p.createVector(mag * p.cos(theta),mag * p.sin(theta));
		// Create a new Node instance
		var node = new Node ({
			neuron_timer: 	_this.neuron_timer * p.random(0.8,0.85),
			max_depth: 		_this.max_depth,
			position: 		_this.position,
			velocity: 			  newvel,
			depth: 			_this.depth,
			p: 					  p,
		});
		
		_this.addChild(node);
		_this.leaf = false;
		// Return a new Node
		return node;
	}
}

