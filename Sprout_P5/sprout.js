// Growing Neurons
// Alex Norton :: 2015
// https://github.com/alexnortn/Explore.Eye

// Recursive Neuron (P5js)

// Running the sketch in instance mode, don't forget to preface all P5 methods with { p }
var sprout = function( p ) {
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
	function p.preload() {

  	}

	function p.setup() {
		p.createCanvas(window.innerWidth, window.innerHeight);
		p.noCursor();
		// Initialize the nnn with args[0] = neuron amount, args[1] = general complexity
		nnn = new Nnn(1, 14);
		nnn.initialize();
	}

	function p.draw() {
		p.background(25);
		// Run the nnn
		nnn.run();
		// Display meta data
		meta(nnn.neurons[0]);
		// plus_minus();
		iterate();
	}

	function plus_minus() {
		if (frameCount % 120 == 0) {
			nnn.rmv_neuron(1);
			nnn.add_neuron(1);
			recurse();
		}
	}

	function iterate() {
		if (frameCount % 360 == 0) {
			avg = avg_node(nnn.neurons[0]);
			p.setup();
			counter++;
		}
	}

	function recurse() {
		Neuron neuron = nnn.neurons[p.round(random(nnn.neurons.length))];
		nnn.neurons.forEach(function(n) {
		if (n.leaf) {
			for (Node nn: neuron.adj(n)) {
				nn.size = true;
			}
				console.log(neuron.adj(n));
			break;
		}
		});
	}


	// Quick Max Calc : Returns Integer
	function max_node(n) {
		if (n.nodes.length > mxn) mxn = n.nodes.length;
		return mxn;
	}

	// Quick Avg Calc : Returns Integer
	function avg_node(n) {
		all_nodes += n.nodes.length;
		avg = p.round(all_nodes / (counter+1));
		return avg;
	}

	// User Interactions
	function mousePressed() {
		mousePos = p.createVector(mouseX, mouseY);
		nnn.add_neuronn(mousePos);
	}

	// .
	// .
	// .
	// Classes
	// .
	// .
	// .

}

// Instantiate the entire P5 sketch
var annn = new p5(sprout);


