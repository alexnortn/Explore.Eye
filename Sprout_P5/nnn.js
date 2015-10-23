// Growing Neurons
// Alex Norton :: 2015
// https://github.com/alexnortn/Explore.Eye

// Recursive Neuron (w/ ArrayList)

// A class for controlling the interactions across the enire network

function Nnn(nc,cp) {
	this.num_neurons = nc;
	this.complexity = cp;
	this.neurons = [];

	function initialize() {
		for (var i=0; i < num_neurons; i++) {
			// Set Neuron Soma Position (Root)
			// Start all neurons in center: Repel()
			var x = (width/2) + p.random(1);
			var y = (height/2) + p.random(1);
			neuron_pos = p.createVector(x,y);
			// Initialize Neuron
			add_neuron(neuron_pos);
		}
	}
	
	// Simple method for running the neurons
	function run() {
		neurons.forEach(function(neuron) {
			neuron.update();
		});
	}

	// Add neuron to the network --> Accepts P5.Vector for Arg
	function add_neuron(pos) {
		// Create Neurons with similar general levels of complexity
		var branches = p.round(p.random(5,9));
		var depth = complexity - branches;
		// Given a constant branching speed, this controls neuron size
		// does not effect morphology.
		// Grow time is inversely proportional to branches
		var neuron_time = 400 / branches;
		// Initialize Neuron object
		neurons.push(new Neuron(pos, branches, neuron_time, depth));
		neurons[neurons.length].neuron_setup();
	}

	// Remove neuron to the network
	function rmv_neuron(count) {
		for (var i=0; i < count; i++) {
			var j = p.floor(p.random(neurons.length));
			neurons.splice(j, 1);;
		}
	}

}

