// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Recursive neuron (w/ ArrayList)
// Nature of Code, Chapter 8

// Recursive dendriteing "structure" without an explicitly recursive function
// Instead we have an ArrayList to hold onto N number of elements
// For every element in the ArrayList, we add 2 more elements, etc. (this is the recursion)

// An arraylist that will keep track of all current dendritees
ArrayList<Node> nodes;
ArrayList<PVector> vertices;
ArrayList<Synapse> leaves;

void setup() {
  size(640,360);
  // fullScreen();
  background(255);
  // Setup the arraylist and add one dendrite to it
  nodes = new ArrayList<Node>();
  leaves = new ArrayList<Synapse>();
  // Create root node
  Node n = new Node(new PVector(width/2,height/2),new PVector(1,0),50,0);
  // Add to arraylist
  nodes.add(n); 
  // A dendrite has a starting location, a starting "velocity", and a starting "timer"
  int num_dendrites = int(random(5,8));
  // int num_dendrites = 5;
  float theta = TWO_PI / num_dendrites;  
  // Create seed dendritees
  for(int i = 0; i < num_dendrites; i++) {
    float start_angle = (theta * i) + radians(random(-10,10));
    float x = sin(start_angle);
    float y = cos(start_angle);
    // Branch a bunch of times
    nodes.add(n.branch(degrees(start_angle)));
  }
}

void draw() {
  background(255);

  // Let's stop when the arraylist gets too big
  // For every dendrite in the arraylist
  for (int i = nodes.size()-1; i >= 1; i--) {
    // Get the dendrite, update and draw it
    Node n = nodes.get(i);
    n.update();
    n.render();
    // If it's ready to split
    if (n.timeToNode()) {
      if (n.depth < 4 ) {
        //neuron.remove(i);             // Delete it
        nodes.add(n.branch(30));   // Add one going right
        nodes.add(n.branch(-30));   // Add one going left
      } 
      else {
        // leaves.add(new Synapse(b.end));
      }
    }
  }
  
  for (Synapse synapse : leaves) {
     synapse.display(); 
  }

}

// Recurse through nodes to specified depth
Node recurse(Node c, int depth) {
  if(c.parent == null) {
    println("Node is Root");
    return c;
  }
  else if (depth == 0) {
    println("End Recursion : "+c);
    return c;
  }
  else {
    return recurse(c.parent, depth-1);
  }
}

// Recurse through nodes to root
Node recurseMore(Node c) {
  if(c.parent == null) {
    println("Currently At Root Node: " + c);
    return c;
  }
  else {
    println("Currently At Node: " + c + " And at Depth : " + c.depth);
    return recurseMore(c.parent);
  }
}

void keyPressed() {
  if(keyCode == TAB) {
    // Refresh
    setup();
  }
  if(keyCode == 48) {
    // Find random point
    int index = int(random(0,(nodes.size()-1)));
    Node n = nodes.get(index);
    println(n.parent);
    n.size = true;
    recurseMore(n);
  }
  if(keyCode == 49) {
    // Find roots
    for(int i=0; i < nodes.size()-1; i++) {
      Node n = nodes.get(i);
      if (n.parent == null) println("Node " + i + " is a root : "+n);
    }
  }
  if(keyCode == 50) {
    // Find leaves
    for(int i=0; i < nodes.size()-1; i++) {
      Node n = nodes.get(i);
      if (n.children.size() == 0) println("Node " + i + " is a leaf : "+n);
    }
  }
  if(keyCode == 51) {
    // Find roots
    for(int i=0; i < nodes.size()-1; i++) {
      Node n = nodes.get(i);
      if (n.depth == 2) println("Node " + i + " is at depth : "+n.depth);
    }
  }
    if(keyCode == 52) {
    // Find roots
    for(int i=0; i < nodes.size()-1; i++) {
      Node n = nodes.get(i);
      if (n.depth == 3) println("Node " + i + " is at depth : "+n.depth);
    }
  }
    if(keyCode == 53) {
    // Find roots
    for(int i=0; i < nodes.size()-1; i++) {
      Node n = nodes.get(i);
      if (n.depth == 4) println("Node " + i + " is at depth : "+n.depth);
    }
  }      
}


