// Growing Neurons
// Alex Norton :: 2015
// https://github.com/alexnortn/Explore.Eye

// Recursive Neuron (w/ ArrayList)


// Import PDF Export
import processing.pdf.*;


Nnn nnn;
int counter = 0;
boolean record = false;

void setup() {
  // size(1000,800);
  fullScreen();
  background(25);
  // frameRate(15);
  noCursor();

  // Initialize the nnn
  nnn = new Nnn(1);
  nnn.initialize();

  // Record PDF
  String pdf = "Neuron_Itr: " + str(counter);
  if (record) beginRecord(PDF, pdf+".pdf"); 

}

void draw() {
  background(25);
  // Run the nnn
  nnn.run();
  // Display meta data
  meta(nnn.neurons.get(0));

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
  if (frameCount % 240 == 0) {
    if(record) endRecord();
    setup();
    counter++;
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

void meta(Neuron n) {
  // Make fonts
  PFont whitney;
  whitney = createFont("WhitneyHTF-BoldSC.otf", 18);
  PFont whitney_m;
  whitney_m = createFont("WhitneyHTF-Medium.otf", 12);
  // Make meta
  String[] meta_name = new String[5];
  String[] meta_value = new String[5];
    meta_value[0] = str(counter);              // Number of Interations
    meta_value[1] = str(n.neuron_timer);        // Neuron Timer
    meta_value[2] = str(n.max_depth);          // Max Depth
    meta_value[3] = str(n.nodes.size());  // Node Size
    meta_value[4] = str(n.num_branches);      // Number of Branches
    meta_name[0] = "neuron interation:";
    meta_name[1] = "timer:";
    meta_name[2] = "max depth:";
    meta_name[3] = "node count:";
    meta_name[4] = "branch count:";
  // Draw Text
  for(int i=0; i<meta_name.length; i++) {
    textAlign(RIGHT);
    textFont(whitney);
    text(meta_name[i], 250, 100 + (i*50));
    textAlign(LEFT);
    textFont(whitney_m);
    text(meta_value[i], 275, 100 + (i*50));

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
      // n.dw = !n.dw;
    }
  }          
}

void mousePressed() {
  PVector mousePos = new PVector(mouseX, mouseY);
  nnn.add_neuronn(mousePos);
}


