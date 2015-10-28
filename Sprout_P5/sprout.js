// Growing Neurons
// Alex Norton :: 2015
// https://github.com/alexnortn/Explore.Eye

// Recursive Neuron (P5js)

// Running the sketch in instance mode, don't forget to preface all P5 methods with { p }
var sprout = function (p) {
	// Global Variables
	// 
	// Nnn Object
	var nnn;  // There are no types in js --> declare as var --> initialize with "new" keyword and type
	// int
	var counter = 0;
	var mxn = 0;
	var avg = 0;
	var all_nodes = 0;
	// boolean
	var loop = true;

	// Preload any required assets
	// p.preload = function() {

	// }

	p.setup = function() {
		p.createCanvas(window.innerWidth, window.innerHeight);
		// p.noCursor(); // Only enable this for desktop --> Kind of rude otherwise

		p.frameRate(30);

		network_start();
	}

	p.draw = function() {
		p.background(25);
		// Run the nnn
		nnn.run();

		// plus_minus();
		iterate();

	}

	network_start = function() {
		// Initialize the nnn with args[0] = neuron amount, args[1] = general complexity, args[2] = 'p' instance
		nnn = new Nnn ({
			num_neurons: 15,
			complexity:  13,
			p:           p,
		});

		nnn.initialize();
	}

	plus_minus = function() {
		if (p.frameCount % 120 == 0) {
			nnn.rmv_neuron(1);
			nnn.add_neuron(1);
			recurse();
		}
	}

	iterate = function() {
		if (p.frameCount % 360 == 0) {
			avg = avg_node(nnn.neurons[0]);
			network_start();
			counter++;
			// p.noLoop();

		}
	}

	recurse = function() {
		var neuron = nnn.neurons[p.round(p.random(nnn.neurons.length))];
		nnn.neurons.forEach(function(n) {
		if (n.leaf) {
			neuron.adj(n).forEach(function(nn) {
				nn.size = true;
			});
				console.log(neuron.adj(n));
			// break;
		}
		});
	}


	// Quick Max Calc : Returns Integer
	max_node = function(n) {
		if (n.nodes.length > mxn) mxn = n.nodes.length;
		return mxn;
	}

	// Quick Avg Calc : Returns Integer
	avg_node = function(n) {
		all_nodes += n.nodes.length;
		avg = p.round(all_nodes / (counter+1));
		return avg;
	}

	// User Interactions
	mousePressed = function() {
		mousePos = p.createVector(p.mouseX, p.mouseY);
		nnn.add_neuronn(p.mousePos);
	}

}

// Instantiate the entire P5 sketch
new p5(sprout);


