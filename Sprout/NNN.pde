// Growing Neurons
// Alex Norton :: 2015
// https://github.com/alexnortn/Explore.Eye

// Recursive Neuron (w/ ArrayList)

// A class for controlling the interactions across the enire network

class Nnn {
  int num_neurons;
	int complexity;
	ArrayList<Neuron> neurons;
	PVector neuron_position;

  Nnn (int nc, int cp) {
  	num_neurons = nc;
  	complexity = cp;
    neurons = new ArrayList<Neuron>();
  }

  void initialize() {
  	for (int i=0; i < num_neurons; i++) {
	    neuron_position = new PVector(width/2,height/2);
	    // Create Neurons with similar general levels of complexity
	    int branches = int(random(5,9));
	    int depth = complexity - branches;
	    // Given a constant branching speed, this controls neuron size, does not effect morphology
	    // Grow time is inversely proportional to branches
	    float neuron_time = 400/branches;
	    // Initialize array of Neuron objects
	    neurons.add(new Neuron(neuron_position, branches, neuron_time, depth));
	    neurons.get(i).neuron_setup();
	  }
  }
  // Simple method for running the neurons
  void run() {
  	for (Neuron neuron: neurons) {
    	neuron.update();
  	}
  }

  // Add neuron to the network
  void add_neuron(int count) {
    for (int i=0; i < count; i++) {
	    neuron_position = new PVector(random(width),random(height));
	    int branches = int(random(7,12));
	    float neuron_time = random(10,40);
	    int depth = int(random(5,12));
	    // Initialize array of Neuron objects
	    neurons.add(new Neuron(neuron_position, branches, neuron_time, depth));
	    neurons.get(neurons.size()-1).neuron_setup(); 
	    println("neurons.size: "+neurons.size());
	  }
  }

  // Add neuron to the network
  void add_neuronn(PVector pos) {
    neuron_position = new PVector(pos.x,pos.y);
    int branches = int(random(7,12));
    float neuron_time = random(10,40);
    int depth = int(random(5,12));
    neurons.add(new Neuron(neuron_position, branches, neuron_time, depth));
    neurons.get(neurons.size()-1).neuron_setup(); 
    println("neurons.size: "+neurons.size());
	}

   // Remove neuron to the network
  void rmv_neuron(int count) {
    for (int i=0; i < count; i++) {
	    int j = int(random(neurons.size()));
	    neurons.remove(j);
	  }
  }

}
