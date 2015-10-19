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
  size(1000,800);
  // fullScreen();
  background(255);
  // Setup the arraylist and add one dendrite to it
  nodes = new ArrayList<Node>();
  leaves = new ArrayList<Synapse>();
  // Create root node
  Node n = new Node(new PVector(width/2,height/2),new PVector(1,1),50,0);
  // Add to arraylist
  nodes.add(n); 
  // A dendrite has a starting location, a starting "velocity", and a starting "timer"
  int num_dendrites = int(random(5,8));
  // int num_dendrites = 1;
  float theta = TWO_PI / num_dendrites;  
  // Create seed dendritees
  for(int i = 0; i < num_dendrites; i++) {
    float start_angle = (theta * i);
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
      if (n.depth < 10 ) {
        if(n.depth % 2 == 0) {
          //neuron.remove(i);             // Delete it
          nodes.add(n.branch(30));   // Add one going right
          nodes.add(n.branch(-30));   // Add one going left
        } else {
          nodes.add(n.branch(random(-30,30)));
        }
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
Node recurse(Node n, int depth) {
  if(n.parent == null) {
    println("Node is Root");
    return n;
  }
  else if (depth == 0) {
    println("End Recursion : "+n);
    return n;
  }
  else {
    return recurse(n.parent, depth-1);
  }
}

// Recurse through nodes to root
ArrayList<Node> recurseMore(Node n, ArrayList<Node> p) {
  ArrayList<Node> path = new ArrayList<Node>();
  path = p;
  if(n.parent == null) {
    return path;
  }
  else {
    path.add(n.parent);
    return recurseMore(n.parent, path);
  }
}

ArrayList<Node> adj(Node n) {
  ArrayList<Node> path = new ArrayList<Node>();
  n.start_point = true;
  recurseMore(n, path);
  return path;
}

void keyPressed() {
  if(keyCode == TAB) {
    // Refresh
    setup();
  }
  if(keyCode == 48) {
    for (Node n: nodes) {
      if (n.leaf) {
        for (Node nn: adj(n)) {
          nn.size = true;
        }
        println(adj(n));
        break;
      }
    }
  }
  if(keyCode == 49) {
    // Find roots
    for(int i=0; i < nodes.size()-1; i++) {
      Node n = nodes.get(i);
      if (n.parent == null) println("Node " + i + " is a root : "+n + " : " + n.end.mag() + " "+ n.end.heading());
    }
  }
  if(keyCode == 50) {
    // Find leaves
    for(int i=0; i < nodes.size()-1; i++) {
      Node n = nodes.get(i);
      if (n.children.size() == 0) println("Node " + i + " is a leaf : "+n + " : " + n.end.mag() + " "+ n.end.heading());
    }
  }
  if(keyCode == 51) {
    // Find roots
    for(int i=0; i < nodes.size()-1; i++) {
      Node n = nodes.get(i);
      if (n.depth == 2) println("Node " + i + " is at depth : "+n.depth + " : " + n.end.mag() + " "+ n.end.heading());
    }
  }
    if(keyCode == 52) {
    // Find roots
    for(int i=0; i < nodes.size()-1; i++) {
      Node n = nodes.get(i);
      if (n.depth == 3) println("Node " + i + " is at depth : "+n.depth + " : " + n.end.mag() + " "+ n.end.heading());
    }
  }
    if(keyCode == 53) {
    // Find roots
    for(int i=0; i < nodes.size()-1; i++) {
      Node n = nodes.get(i);
      if (n.depth == 4) println("Node " + i + " is at depth : "+n.depth + " : " + n.end.mag() + " "+ n.end.heading());
    }
  }      
}


