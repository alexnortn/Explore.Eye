// Growing Neurons
// Alex Norton :: 2015
// https://github.com/alexnortn/Explore.Eye

// Recursive Neuron (w/ ArrayList)




Nnn nnn;

void setup() {
  // size(1000,800);
  fullScreen();
  background(25);
  // frameRate(5);
  noCursor();

  // Initialize the nnn
  nnn = new Nnn(1);
  nnn.initialize();

}

void draw() {
  background(25);
  // Run the nnn
  nnn.run();
  // plus_minus();
  iterate();
}

void plus_minus() {
  if (frameCount % 120 == 0) {
    nnn.rmv_neuron(1);
    nnn.add_neuron(1);
    recurse();
  }
}

void iterate() {
  if (frameCount % 180 == 0) {
    setup();
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
  if(keyCode == 54) { // Key:7
    nnn.add_neuron(1); 
  }
  if(keyCode == 55) { // Key:8
    nnn.rmv_neuron(1);
  }
  if(keyCode == 32) { // Key:SPACE
    for (Node n: nnn.neurons.get(0).nodes) {
      n.dw = !n.dw;
    }
  }          
}

void mousePressed() {
  PVector mousePos = new PVector(mouseX, mouseY);
  nnn.add_neuronn(mousePos);
}


