// Growing Neurons
// Alex Norton :: 2015
// https://github.com/alexnortn/Explore.Eye

// Recursive Neuron (w/ ArrayList)

// A class for defining the spring interactions between nodes

// Constructor
function Spring(args) {
	args = args || {};

	var p = args.p || p5;

	// Initialize spring with 2 Nodes and a resting length
	// For now, we'll precalculate
	// No, calculate resting length on instantiation
	this.node1 = args.node1 || {};
	this.node2 = args.node2 || {};
	this.rest_length = args.rest_length || 0;

	// Starting position (p5.Vector)
	var node1_start_pos = this.node1.position.copy();

	// Spring constant
	var k = 0.2;

	// Calculate spring force between neighbors
	this.neighbor = function() {
		var _this = this;
		// Vector pointing from anchor to bob location
		var force = p5.Vector.sub(_this.node1.position, _this.node2.position);
		// What is distance
		var current_length = force.mag();
		// Stretch is difference between current distance and rest length
		var displacement = current_length - _this.rest_length;

		// Calculate force according to Hooke's Law
		// F = k * stretch
		force.normalize();
		force.mult(-1 * k * displacement);

		_this.node1.applyForce(force);	//
		force.mult(-1); 			// Mult (-1) so they attract || repel !
		_this.node2.applyForce(force);	//
	}

	// Calculate spring force from original starting pt
	this.self = function() {
		var _this = this;
		// Vector pointing from anchor to bob location
		var force = p5.Vector.sub(_this.node1.position, node1_start_pos);
		// What is distance --> In this case anything > 0 is a displacement
		var displacement = force.mag();

		// Calculate force according to Hooke's Law
		// F = k * stretch
		force.normalize();
		force.mult(-1 * k * displacement);
		// console.log(force);

		// Apply a force pointing towards starting
		_this.node1.applyForce(force);
	}

	this.update = function() {
		var _this = this;
		// Update springs
		_this.self();
		_this.neighbor();
	}

	this.display = function() {
		var _this = this;
		p.push();
			p.strokeWeight(1);
			p.stroke(255,0,0);
			p.line(
				_this.node1.position.x,
				_this.node1.position.y,
				_this.node2.position.x,
				_this.node2.position.y
			);
		p.pop();
	}
}

