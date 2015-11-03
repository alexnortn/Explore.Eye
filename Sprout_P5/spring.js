// Growing Neurons
// Alex Norton :: 2015
// https://github.com/alexnortn/Explore.Eye

// Recursive Neuron (w/ ArrayList)

// A class for defining the spring interactions between nodes

// Constructor
Spring(args) {
	args = args || {};

	var p = args.p || p5;

	// Initialize spring with 2 Nodes and a resting length
	// For now, we'll precalculate
	// No, calculate resting length on instantiation
	this.node1 = args.node1 || {};
	this.node2 = args.node2 || {};
	this.rest_length = args.rest_length || 0;

	// Spring constant
	float k = 0.2;

	} 

	// Calculate spring force
	this.update = function() {
		var _this = this;
		// Vector pointing from anchor to bob location
		var force = p5.Vector.sub(_this.node1.position, _this.node2.position);
		// What is distance
		var current_length = force.mag();
		// Stretch is difference between current distance and rest length
		var displacement = current_length - rest_length;

		// Calculate force according to Hooke's Law
		// F = k * stretch
		force.normalize();
		force.mult(-1 * k * displacement);

		node1.applyForce(force);	//
		force.mult(-1); 			// Mult (-1) so they attract || repel !
		node2.applyForce(force);	//
	}

	this.display = function() {
		p.push();
			p.strokeWeight(2);
			p.stroke(255,0,0);
			p.line(node1.position.x, node1.position.y, node2.position.x, node2.position.y);
		p.pop();
	}
}

