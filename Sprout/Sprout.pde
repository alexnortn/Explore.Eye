

Neuron neuron;
Neuron[] neurons = new Neuron[1];
PVector neuron_position;

void setup() {
  // size(1000,800);
  fullScreen();
  background(255);

  for (int i=0; i < 1; i++) {
    neuron_position = new PVector(width/2,height/2);
    int branches = int(random(3,10));
    float neuron_time = random(10,40);
    int depth = int(random(5,12));

    neurons[i] = new Neuron(neuron_position, branches, neuron_time, depth);
    neurons[i].neuron_setup();

  }

}

void draw() {
  background(255);
  for (Neuron neurona: neurons) {
    neurona.update();
  }

}

void keyPressed() {
  if(keyCode == TAB) {
    // Refresh
    setup();
  }
  if(keyCode == 48) {
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
  if(keyCode == 49) {
    // Find roots
    for(int i=0; i < neuron.nodes.size()-1; i++) {
      Node n = neuron.nodes.get(i);
      if (n.parent == null) println("Node " + i + " is a root : "+n + " : " + n.end.mag() + " "+ n.end.heading());
    }
  }
  if(keyCode == 50) {
    // Find leaves
    for(int i=0; i < neuron.nodes.size()-1; i++) {
      Node n = neuron.nodes.get(i);
      if (n.children.size() == 0) println("Node " + i + " is a leaf : "+n + " : " + n.end.mag() + " "+ n.end.heading());
    }
  }
  if(keyCode == 51) {
    // Find roots
    for(int i=0; i < neuron.nodes.size()-1; i++) {
      Node n = neuron.nodes.get(i);
      if (n.depth == 2) println("Node " + i + " is at depth : "+n.depth + " : " + n.end.mag() + " "+ n.end.heading());
    }
  }
    if(keyCode == 52) {
    // Find roots
    for(int i=0; i < neuron.nodes.size()-1; i++) {
      Node n = neuron.nodes.get(i);
      if (n.depth == 3) println("Node " + i + " is at depth : "+n.depth + " : " + n.end.mag() + " "+ n.end.heading());
    }
  }
    if(keyCode == 53) {
    // Find roots
    for(int i=0; i < neuron.nodes.size()-1; i++) {
      Node n = neuron.nodes.get(i);
      if (n.depth == 4) println("Node " + i + " is at depth : "+n.depth + " : " + n.end.mag() + " "+ n.end.heading());
    }
  }      
}


