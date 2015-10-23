// Growing Neurons
// Alex Norton :: 2015
// https://github.com/alexnortn/Explore.Eye

// Recursive Neuron (w/ ArrayList)

// A class for controlling the interactions across the enire network

function Nnn(args) {
	args = args || {};

	// Private arguments from constructor
	var p = args.p;

	// Public arguments from constructor
	this.num_neurons = args.nc || 1;
	this.complexity = args.cp  || 13;

	// Generic public array variable : not an argument though
	this.neurons = [];

	this.initialize = function() {
		for (var i=0; i < this.num_neurons; i++) {
			// Set Neuron Soma Position (Root)
			// Start all neurons in center: Repel()
			var x = (p.width/2) + p.random(1);
			var y = (p.height/2) + p.random(1);
			this.neuron_pos = p.createVector(x,y);
			// Initialize Neuron
			this.add_neuron(this.neuron_pos);
		}
	}
	
	// Simple method for running the neurons
	function run() {
		this.neurons.forEach(function(neuron) {
			neuron.update();
		});
	}

	// Add neuron to the network --> Accepts P5.Vector for Arg
	this.add_neuron = function(location) {
		// Create Neurons with similar general levels of complexity
		var num_branches = p.round(p.random(6,9));
		var max_depth = this.complexity - num_branches;
		// Given a constant branching speed, this controls neuron size
		// does not effect morphology.
		// Grow time is inversely proportional to num_branches
		var neuron_timer = 400 / num_branches;
		// Initialize the Neuron Object:
		// 		args[0] = Pvector location
		// 		args[1] = int num_branches
		// 		args[2] = float neuron_timer
		// 		args[3] = int max_depth
		// 		args[4] = 'p' instance
		this.neurons.push(
			new Neuron ({
				location: location,
				num_branches: num_branches,
				neuron_timer: neuron_timer,
				max_depth: max_depth,
				p: p,
			})	
		);


		this.neurons[this.neurons.length].neuron_setup();
	}

	// Remove neuron to the network
	this.rmv_neuron = function(count) {
		for (var i=0; i < count; i++) {
			var j = p.floor(p.random(this.neurons.length));
			this.neurons.splice(j, 1);;
		}
	}

}

