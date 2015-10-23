// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Recursive Tree (w/ ArrayList)

// A class for a leaf that gets placed at the location of 
// the last branches

// Contructor: P5.Vector, Integer, Float, Integer

function Neuron (args) {
	args = args || {};

	this.num_branches = args.num_branches || 0;

}

new Neuron ({
	num_branches: 5,
})



function Neuron (loc,b,t,mxd, p) {
	this.location = loc.copy();
	this.num_branches = b;
	this.neuron_timer = t;
	this.max_depth = mxd;
	this.growing = true;
	// Setup the arraylist and add one dendrite to it
	nodes = [];
	leaves = [];

	// Call methods to access outside of class this way!
	this.neuron_setup = function()
	function neuron_setup() {
		var start_velocity = p.createVector(2,2); // Change this value to determine simulation speed
		// Create a new Node instance
		var n = new Node(this.location, start_velocity, this.neuron_timer, 0, this.max_depth);
		// Add to arraylist
		nodes.push(n); 
		var theta = p.TWO_PI / num_branches;  
		// Random rotational offset constant
		var theta_const = p.random(p.TWO_PI); 
		// Create seed dendritees
		for (var i=0; i < num_branches; i++) {
			// Create a unique initial offset velocity heading for each branch with respect to the total
			// number of seed branches, for additional diversity, add a random rotational offset
			var start_angle = (theta * i) + p.radians(p.random(-15,15)) + p.random(p.TWO_PI);
			// Convert from polar to cartesian coordinates
			var x = p.sin(start_angle);
			var y = p.cos(start_angle);
			// Branch a bunch of times
			nodes.push(n.branch(p.degrees(start_angle)));
		}
	}

	function update() {
		// Let's stop when the neuron gets too deep
		// For every dendrite in the arraylist
		for (var i = nodes.length-1; i >= 1; i--) {
			// Get the dendrite, update and draw it
			var n = nodes[i];
			n.run(nodes);
			// If it's ready to split
			if (n.timeToNode()) {
				// If we havn't reached stopping depth (growth bounded by depth and then time)
				if (n.depth < this.max_depth ) {
					// For every other node added: add one or two branches to create natural form
					// Could definitely have a better way of accessing neuron depth.. that would improve branching
					if (((n.depth+1) % 2 == 0) && (n.depth != 2)) {
						nodes.push(n.branch(10));    // Add one going right
						nodes.push(n.branch(-10));   // Add one going left
					} else {
						// Additional method for probabalistic branching
						// Default rnd = 15% : could be push higher
						// Neuron feels slightly over complicated given complexity: 13 & min [5] branches
						var rnd = p.random(1);
						if ((rnd < 0.15) && ((n.depth + 1) < this.max_depth )) {
							nodes.push(n.branch(10));    // Add one going right
							nodes.push(n.branch(-10));   // Add one going left
						} else {
							// Added leaves to end of Neuron --> Can be vastly improved to consider
							// the entire 'distal' zone of the neuron.
							nodes.push(n.branch(p.round(p.random(-20,20))));
						} 
					}
				} 
				else {
					leaves.push(new Synapse(n.location));
				}
			}
		}
		// Add boutons --> Synapses to leaves of neuron :: Could definitely be improved
		leaves.forEach(function(synapse) {
			synapse.display(); 
		});
	}

	// Recurse through nodes to root --> Returns an array
	//  Args[0]:Node, Args[1]:Array of Nodes
	function recurseMore(n,p) {
		// Make a 'shallow' copy of an array
		var path = p.slice();
		if(n.parent == null) {
			return path;
		} else {
			path.push(n.parent);
			return recurseMore(n.parent, path);
		}
	}

	// Recurse through nodes to root --> Returns an array
	//  Args[0]:Node
	function adj(n) {
		// Make a 'shallow' copy of an array
		var path = p.slice();
		n.start_point = true;
		recurseMore(n, path);
		return path;
	}
}

