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
	this.num_neurons = args.num_neurons || 1;
	this.complexity = args.complexity  || 13;

	// Generic public array variable : not an argument though
	this.neurons = [];

	this.max_depth;
	this.num_branches;

	this.initialize = function() {
		var _this = this;

		// Initialize Neuron
		_this.add_neuron(_this.num_neurons);

	}
	
	// Simple method for running the neurons
	// Call this something like 'renderFrame'
	this.run = function() {
		var _this = this;

		if (_this.done()) {
			console.log("NNN Complete");
			console.log(_this.neurons.length);
			// p.noLoop();
		}

		_this.neurons.forEach(function(neuron) {

			neuron.update();
			neuron.render();
		});
	}

	this.done = function() {
		var _this = this;

		var n;
		for (var i = 0; i < _this.neurons.length; i++) {
			n = _this.neurons[i];
			if (!n.done()) {
				return false;
			}
		}
		
		// _this.neurons.forEach(function(neuron) {
		// 	if (!neuron.done()) {
		// 		return false;
		// 	}
		// });

		return true;

	}

	// Add neuron to the network --> Accepts P5.Vector for Arg
	this.add_neuron = function(count) {
		var _this = this;
		var x, y;

		for (var i = 0; i < count; i++) {
			// Set Neuron Soma Position (Root)
			// Start all neurons in center: Repel()
			if ((count == 1) || (_this.neurons.length < 1)) {
				x = (window.innerWidth / 2) + p.random(1);
				y = (window.innerHeight / 2) + p.random(1);
			}
			else {
				x = (p.random(window.innerWidth));
				y = (p.random(window.innerHeight));
			}

			// Create Neurons with similar general levels of complexity
			_this.num_branches = p.round(p.random(6,8));
			// _this.num_branches = p.floor(p.randomGaussian(7,1));
			// var num_branches = 1;
			_this.max_depth = _this.complexity - _this.num_branches;
			// var max_depth = 4;
			// Given a constant branching speed, this controls neuron size
			// does not effect morphology.
			// Grow time is inversely proportional to num_branches
			var neuron_timer = 650 / _this.num_branches;
			// var neuron_timer = 75;
			// Initialize the Neuron Object:
			// 		args[0] = Pvector position
			// 		args[1] = int num_branches
			// 		args[2] = float neuron_timer
			// 		args[3] = int max_depth
			// 		args[4] = 'p' instance
			_this.neurons.push(
				new Neuron ({
					x: 				x,
					y: 				y,
					num_branches: 	_this.num_branches,
					neuron_timer: 	_this.neuron_timer,
					max_depth: 		_this.max_depth,
					p: 				p,
				})	
			);

			_this.neurons[_this.neurons.length - 1].neuron_setup();

		}
	}

	// Remove neuron to the network
	this.remove_neuron = function(count) {
		var _this = this;
		var j;
		// splice() is a javascript method to working on arrays
		for (var i = 0; i < count; i++) {
			j = p.floor(p.random(_this.neurons.length));
			_this.neurons.splice(j, 1);
		}
	}

}

