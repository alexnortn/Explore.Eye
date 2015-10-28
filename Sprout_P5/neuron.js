// Growing Neurons
// Alex Norton :: 2015
// https://github.com/alexnortn/Explore.Eye

// Recursive Neuron (w/ ArrayList)

// A class for a leaf that gets placed at the position of 
// the last branches

// Contructor: P5.Vector, Integer, Float, Integer
function Neuron (args) {
	args = args || {};

	// Private arguments from constructor
	var p = args.p;
	
	// Public arguments from constructor
	this.position = args.position.copy()    	|| p.createVector(0,0);
	this.num_branches = args.num_branches 	|| 7;
	this.neuron_timer = args.neuron_timer 	|| 60;
	this.max_depth = args.max_depth 	  	|| 6;

	// Generic public array variable : not an argument though
	this.growing = true;
	// Setup public arrays and add one dendrite to it
	this.nodes = [];
	this.leaves = [];

	// Call methods to access outside of class this way!
	this.neuron_setup = function() {
		var start_velocity = p.createVector(2,2); // Change this value to determine simulation speed
		// Create a new Node instance
		var n = new Node ({
					neuron_timer: 	this.neuron_timer,
					max_depth: 		this.max_depth,
					position: 		this.position,
					velocity: 			 start_velocity,
					depth: 				 0,
					p: 					 p,
				});	
		// Add to arraylist
		this.nodes.push(n); 

		var theta = p.TWO_PI / this.num_branches;  
		// Random rotational offset constant
		var theta_const = p.random(p.TWO_PI); 

		// Create seed dendritees
		for (var i = 0; i < this.num_branches; i++) {
			// Create a unique initial offset velocity heading for each branch with respect to the total
			// number of seed branches, for additional diversity, add a random rotational offset
			var start_angle = (theta * i) + p.radians(p.random(-15, 15)) + theta_const;
			// Convert from polar to cartesian coordinates
			// var x = p.cos(start_angle);
			// var y = p.sin(start_angle);
			// Branch a bunch of times
			this.nodes.push(
				n.branch(p.degrees(start_angle))
			);
		}
	}

	this.update = function() {
		// Let's stop when the neuron gets too deep
		// For every dendrite in the arraylist
		for (var i = this.nodes.length - 1; i >= 1; i--) {
			// Get the Node object, update and draw it
			var n = this.nodes[i];
				n.run(this.nodes);

			// if (i === 5) console.log(n.isGrowing());
			// console.log(n.depth);

			if (n.isGrowing()) {
				continue;
			}

			if (n.depth >= this.max_depth) {
				this.leaves.push(
					new Synapse ({
						position: n.position,
						p: p,
					})
				);
				continue;
			}
			
			if (n.leaf) {
				// For every other node added: add one or two branches to create natural form
				// Could definitely have a better way of accessing neuron depth.. that would improve branching
				if (((n.depth + 1) % 2 == 0) && (n.depth != 2)) {
					this.nodes.push(n.branch(10));    // Add one going right
					this.nodes.push(n.branch(-10));   // Add one going left
				} 
				else {
					// Additional method for probabalistic branching
					// Default rnd = 15% : could be push higher
					// Neuron feels slightly over complicated given complexity: 13 & min [5] branches
					var rnd = p.random(1);
					if ((rnd < 0.15) && ((n.depth + 1) < this.max_depth )) {
						this.nodes.push(n.branch(10));    // Add one going right
						this.nodes.push(n.branch(-10));   // Add one going left
					} 
					else {
						// Added leaves to end of Neuron --> Can be vastly improved to consider
						// the entire 'distal' zone of the neuron.
						this.nodes.push(
							n.branch(p.round(p.random(-20,20)))
						);
					} 
				}
			}
		}

		// Add boutons --> Synapses to leaves of neuron :: Could definitely be improved
		this.leaves.forEach(function (synapse) {
			synapse.display(); 
		});
	}

	// Recurse through nodes to root --> Returns an array
	//  Args[0]:Node
	this.adj = function(n) {
		// Recurse through nodes to root --> Returns an array
		//  Args[0]:Node, Args[1]:Array of Nodes
		function recurseMore (n, parents) {
			// Make a 'shallow' copy of an array
			var path = parents.slice();
			if (n.parent == null) {
				return path;
			} 
			else {
				path.push(n.parent);
				return recurseMore(n.parent, path);
			}
		}

		// Make a 'shallow' copy of an array
		n.start_point = true;
		return recurseMore(n, []);
	}
}

