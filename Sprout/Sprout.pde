// Growing Neurons
// Alex Norton :: 2015
// https://github.com/alexnortn/Explore.Eye

// Recursive Neuron (w/ ArrayList)




Nnn nnn;

void setup() {
  // size(1000,800);
  fullScreen();
  background(255);

  // Initialize the nnn
  nnn = new Nnn(15);
  nnn.initialize();

}

void draw() {
  background(25);
  // Run the nnn
  nnn.run();
  plus_minus();
}

void plus_minus() {
  if (frameCount % 120 == 0) {
    nnn.rmv_neuron(1);
    nnn.add_neuron(1);
    recurse();
  }
}

void recurse() {
  Neuron neuron = nnn.neurons.get(int(random(nnn.neurons.size())));
  for (Node n: neuron.nodes) {
    if (n.leaf) {
      for (Node nn: neuron.adj(n)) {
        nn.size = true;
      }
      println(neuron.adj(n));
      break;
    }
  }
}


// Interactions :: Mostly debugging

void keyPressed() {
  if(keyCode == TAB) { // Key:TAB
    // Refresh
    setup();
  }
  if(keyCode == 48) { // Key:0
    for (Neuron neuron: nnn.neurons) {
      for (Node n: neuron.nodes) {
        if (n.leaf) {
          for (Node nn: neuron.adj(n)) {
            nn.size = true;
          }
          println(neuron.adj(n));
          break;
        }
      }
    }
  }
  if(keyCode == 49) { // Key:1
    // Find roots
    for (Neuron neuron: nnn.neurons) {
      for(int i=0; i < neuron.nodes.size()-1; i++) {
        Node n = neuron.nodes.get(i);
        if (n.parent == null) println("Node " + i + " is a root : "+n + " : " + n.location.mag() + " "+ n.location.heading());
      }
    }
  }
  if(keyCode == 50) { // Key:2
    // Find leaves
    for (Neuron neuron: nnn.neurons) {
      for(int i=0; i < neuron.nodes.size()-1; i++) {
        Node n = neuron.nodes.get(i);
        if (n.children.size() == 0) println("Node " + i + " is a leaf : "+n + " : " + n.location.mag() + " "+ n.location.heading());
      }
    }
  }
  if(keyCode == 51) { // Key:3
    // Find roots
    for (Neuron neuron: nnn.neurons) {
      for(int i=0; i < neuron.nodes.size()-1; i++) {
        Node n = neuron.nodes.get(i);
        if (n.depth == 2) println("Node " + i + " is at depth : "+n.depth + " : " + n.location.mag() + " "+ n.location.heading());
      }
    }
  }
  if(keyCode == 52) { // Key:4
    // Find roots
    for (Neuron neuron: nnn.neurons) {
      for(int i=0; i < neuron.nodes.size()-1; i++) {
        Node n = neuron.nodes.get(i);
        if (n.depth == 3) println("Node " + i + " is at depth : "+n.depth + " : " + n.location.mag() + " "+ n.location.heading());
      }
    }
  }
  if(keyCode == 53) { // Key:5
    // Find roots
    for (Neuron neuron: nnn.neurons) {
      for(int i=0; i < neuron.nodes.size()-1; i++) {
        Node n = neuron.nodes.get(i);
        if (n.depth == 4) println("Node " + i + " is at depth : "+n.depth + " : " + n.location.mag() + " "+ n.location.heading());
      }
    }
  }
  if(keyCode == 54) { // Key:6
    nnn.add_neuron(1);
  }
  if(keyCode == 55) { // Key:7
    nnn.rmv_neuron(1);
  }        
}


