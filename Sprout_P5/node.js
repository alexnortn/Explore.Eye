// Growing Neurons
// Alex Norton :: 2015
// https://github.com/alexnortn/Explore.Eye

// Recursive Neuron (w/ ArrayList)

// A class for extending a Neuron with Sum Weighted Forces across nodes
	// Contructor: 
		//  P5.Vector: 	location
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
	this.start = args.location.get() || p.createVector();
	this.location = args.location.get() || p.createVector();
	this.velocity = args.velocity.get() || p.createVector();
	// Public floats
	this.neuron_timer = args.neuron_timer || 0;
	this.max_depth = args.max_depth || 7;
	this.depth = args.depth || 0;

	// Not in constructor
	this.acceleration = p.createVector(0,0);

	// Setup public arrays for children Nodes and Adjacency List
	this.children = [];
	this.adj_list = [];
	// Public array of vectors to contain coordinates for Catmull Rom paths
	this.curve_pts = [4]; 
	
	// Node Object :: Can only ever have a single parent
	this.parent;

	// Public Booleans
	this.growing = true;
	this.leaf = true;
	this.size = false;
	this.start_point = false;
	this.dw = true;

	// Floats
	var   inimult,     // Initial offset multiplier
		  sepmult,     // Separation multiplier

	// Private variables
	var wandertheta = 0;
	var wan_const = 1.0;
	var maxspeed = 1.5;       // Default 2
	var maxforce = p.random(0.8,1);    // Default 0.05
	var timer = neuron_timer;

	// Increment for each instantiation at a branch event
	depth++;

	// var n :: Node()
	this.addChild = function(n) {
		n.parent = this;
		this.children.push(n);
	} 

	// var n :: Node()
	this.addParent = function(n) {
		n.addChild(this);
	}

	// Set curve points
	function pt_0() {
		var p_0 = p.createVector();
		if (this.parent.parent == null) {
			p_0 = this.start.get();       
			return p_0;
		} else {
			return p_0.set(this.parent.start.x,this.parent.start.y);
		}
	}
	function pt_1() {
			var p_1 = p.createVector();
			return p_1.set(this.start.x,this.start.y);
		}
	function pt_2() {
		var p_2 = p.createVector();
		  return p_2.set(this.location.x,this.location.y);
		}
	function pt_3() {
		var p_3 = p.createVector();
		if (this.leaf) {
		  // If we're at the location, create a random vector
		  return p_3.random2D();
		} else {
		  if (this.children.length == 1){
			return p_3.set(this.children[0].location.x,this.children[0].location.y);
		  } else if (this.children.length[] > 1) {
			  for (var i=0; i < this.children.length; i++) {
				p_3.add(this.children.length[0].location);
			  }
			  p_3.div(this.children.length);
			  return p_3;
		  } else {
			return p_3.set(this.location.x,this.location.y);
		  }
		}
	}

	this.wander = function() {
		var wanderR = 25;         						// Radius for our "wander circle"
		var wanderD = 80;         						// Distance for our "wander circle"
		var change = 0.3;
		this.wandertheta += p.random(-change,change);   // Randomly change wander theta

		// Now we have to calculate the new location to steer towards on the wander circle
		var circleloc = this.velocity.get();    		// Start with velocity
			circleloc.normalize();            			// Normalize to get heading
			circleloc.mult(wanderD);          			// Multiply by distance
			circleloc.add(this.location);               // Make it relative to boid's location

		var h = this.velocity.heading2D();        		// We need to know the heading to offset wandertheta

		var circleOffSet = p.createVector(wanderR * p.cos(this.wandertheta+h), wanderR * p.sin(this.wandertheta+h));
		var target = p.p5.Vector.add(circleloc,circleOffSet);

		// Render wandering circle, etc. 
		if(dw) drawWanderStuff(this.location,circleloc,target,wanderR);

		// Returns call to seek() and a vector object
		return this.seek(target);

	}

	// A method just to draw the circle associated with wandering
	function drawWanderStuff(loc,circle,target,rad) {
		p.push();
			p.stroke(100); 
			p.noFill();
			p.ellipseMode(CENTER);
			p.ellipse(circle.x,circle.y,rad*2,rad*2);
			p.ellipse(target.x,target.y,4,4);
			p.line(loc.x,loc.y,circle.x,circle.y);
			p.line(circle.x,circle.y,target.x,target.y);
		p.pop();
	}  

	// A method that calculates and applies a steering force towards a target
	// STEER = DESIRED MINUS VELOCITY
	// Consider using to attract towards another cell or synapse
	// Accepts P5.Vector for argument
	this.seek = function(target) {
		var desired = p.p5.Vector.sub(target,this.location);  // A vector pointing from the location to the target
		// float angle = degrees(desired.heading());
		// inimult =  map(angle,0,180,0,5);  

		// Normalize desired and scale to maximum speed
		desired.normalize();
		desired.mult(this.maxspeed);
		// Steering = Desired minus Velocity
		var steer = p.p5.Vector.sub(desired,this.velocity);
			steer.limit(this.maxforce);  // Limit to maximum steering force

		return steer;
	}

	// Separation
	// Method checks for nearby nodes and steers away
	// Accepts Array as input
	this.separate = function(nodes) {
		var desiredseparation = 50.0;
		var steer = p.createVector(0,0);
		var count = 0;
		// For every node in the system that is a leaf, check if it's too close
		nodes.forEach(function(other) {
		  // if (other.leaf) {
			var d = p.p5.Vector.dist(this.location,other.location);
			// If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
			if ((d > 0) && (d < desiredseparation)) {
				// Calculate vector pointing away from neighbor
				var diff = p.p5.Vector.sub(this.location,other.location);
					diff.normalize();
					diff.div(d*d);        				// Weight by distance
				sepmult = p.map((1/(d*d)),0,1,0,5);     // Proportional to Inverse Distance Squared
				steer.add(diff);
				count++;              					// Keep track of how many
			}
		});
		// Average -- divide by how many
		if (count > 0) {
			steer.div(count);
		}
		// As long as the vector is greater than 0
		if (steer.mag() > 0) {
			// Implement Reynolds: Steering = Desired - Velocity
			steer.normalize();
			steer.mult(this.maxspeed);
			steer.sub(this.velocity);
			steer.limit(this.maxforce);
		}
		return steer;
	}

	// Simple method to sum forces
	// Accepts P5.Vector
	this.applyForce = function(force) {
		this.acceleration.add(force);
	}

	// We accumulate a new acceleration each time based on three rules
	// Accepts an Array of Node objects
	this.expand = function(nodes) {
		var sep = this.separate(nodes);      			// Separation
		var ini = this.seek(this.findRoot(this)).mult(-1); 	// Root Node (multiply by -1 to repel)
		var wan = this.wander();             			// Wander

		// Carefully weight these forces
		sep.mult(1.0);
		ini.mult(1.5);
		wan.mult(this.wan_const);

		// Add the force vectors to acceleration
		this.applyForce(sep);
		this.applyForce(ini);
		this.applyForce(wan);
	}

	// Method to update location
	this.update = function() {
		// Update velocity
		this.velocity.add(this.acceleration);
		// Limit speed
		this.velocity.limit(this.maxspeed);
		this.location.add(this.velocity);
		// Reset accelertion to 0 each cycle
		this.acceleration.mult(0);
	}

	// Draw a dot at location
	this.render = function() {
		// Basic Fractal Lines
		p.stroke(200);
		p.noFill();
		// Array to store curve points
		var pts = [];
			pts[0] = p.createVector(this.pt_0().x, this.pt_0().y);
			pts[1] = p.createVector(this.pt_1().x, this.pt_1().y);
			pts[2] = p.createVector(this.pt_2().x, this.pt_2().y);
			pts[3] = p.createVector(this.pt_3().x, this.pt_3().y);
		// p.line(start.x,start.y,location.x,location.y);
		// Render Curves
		p.curve(pts[0].x,pts[0].y,pts[1].x,pts[1]y,pts[2].x,pts[2].y,pts[3].x,pts[3].y);
		// p.curve(this.pt_0().x,this.pt_0().y,this.pt_1().x,this.pt_1().y,this.pt_2().x,this.pt_2().y,this.pt_2().x,this.pt_2().y);
		// Render Path Home
		if (this.size) {
			p.noStroke();
			p.fill(200,0,0);
			p.ellipse(this.start.x,this.start.y,5,5);
			p.ellipse(this.location.x, this.location.y, 5, 5);
		}
		if (this.start_point) {
			p.noStroke();
			p.fill(200,0,0);
			p.ellipse(this.location.x, this.location.y, 5, 5);
		}
		// Draw Soma
		p.push();
			p.fill(200);
			if (this.depth == 2) p.ellipse(this.start.x,this.start.y,25,25);
		p.pop();
		// Debug Neighborhood
		p.push();
			p.noStroke();
			p.fill(255,10);
			p.ellipse(this.location.x,this.location.y,50,50);
			p.fill(255,255);
		p.pop();
	}

	// Accepts an Array of Node Objects
	this.run = function(nodes) {
		if (this.growing) {
			this.expand(nodes);
			this.update();
		}
			this.render();
	}

	// Recurse through nodes to root
	// Accepts Node object
	// Returns p5.Vector object
	this.findRoot = function(n) {
		if(n.parent == null) {
			return n.location;
		}
		else {
			return this.findRoot(n.parent);
		}
	}

	// Calc T(--)
	this.sub_t = function (mxd) {
		var tt = mxd / 1.5;
		return tt;
	}

	// Did the timer run out?
	// Returns boolean --> Growing?
	this.timeToNode = function () {
		if ((this.depth == 2)||(this.depth == 3)) {
			this.timer -= p.floor(p.random(2,this.sub_t(this.max_depth)));
		} else {
			this.timer--;
		}
		// Make leaves go crazy on final level
		if (this.depth == (this.max_depth-2)) this.wan_const = 3;
		if (this.timer < 0 && this.growing) {
		  // Display Wandering Debug
		  this.dw = false;
		  this.growing = false;
		  // Set branch point
		  return true;
		} 
		else {
		  return false;
		}
	}

	// Create a new dendrite at the current location, but change direction by a given angle
	// Returns a new Node object
	this.branch = function(angle) {
		// What is my current heading
		var theta = this.velocity.heading2D();
		// What is my current speed
		var mag = this.velocity.mag();
		// Turn me
		theta += p.radians(angle);
		// Polar coordinates to cartesian!!
		var newvel = p.createVector(mag * p.cos(theta),mag * p.sin(theta));
		// Create a new Node instance
		var node = new Node ({
					neuron_timer: 	this.neuron_timer * p.random(0.8,0.85),
					max_depth: 		this.max_depth,
					location: 		this.location,
					velocity: 			 new_vel
					depth: 				 this.depth,
					p: 					 p,
				});
		this.addChild(node);
		this.leaf = false;
		// Return a new Node
		return node;
	}
}
