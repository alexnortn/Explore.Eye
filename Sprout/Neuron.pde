// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Recursive Tree (w/ ArrayList)

// A class for a leaf that gets placed at the location of 
// the last branches

class Neuron {

  PVector location;
  float   neuron_timer;
  float   neuron_timerstart;
  int 	  max_depth;
  int     num_branches;

	// An arraylist that will keep track of all current dendritees
	ArrayList<Node> nodes;
	ArrayList<Synapse> leaves;

  boolean growing = true;

  Neuron (PVector loc, int b, float t, int mxd) {
    location = loc.get();
    num_branches = b;
    neuron_timer = t;
    max_depth = mxd;
    // Setup the arraylist and add one dendrite to it
    nodes = new ArrayList<Node>();
    leaves = new ArrayList<Synapse>();
  }

  void neuron_setup() {
    PVector start_velocity = new PVector(2,2); // Change this value to determine simulation speed
    Node n = new Node(this.location, start_velocity, this.neuron_timer, 0);
    // Add to arraylist
    nodes.add(n); 
    float theta = TWO_PI / num_branches;  
    // Create seed dendritees
    for(int i = 0; i < num_branches; i++) {
      float start_angle = (theta * i);
      float x = sin(start_angle);
      float y = cos(start_angle);
      // Branch a bunch of times
      nodes.add(n.branch(degrees(start_angle)));
      // nodes.add(n.branch());
    }
  }

  void update() {
    // Let's stop when the neuron gets too deep
    // For every dendrite in the arraylist
    for (int i = nodes.size()-1; i >= 1; i--) {
      // Get the dendrite, update and draw it
      Node n = nodes.get(i);
      n.run(nodes);
      // If it's ready to split
      if (n.timeToNode()) {
        if (n.depth < this.max_depth ) {
          if(((n.depth+1) % 2 == 0)&&(n.depth != 2)) {
            //neuron.remove(i);             // Delete it
            nodes.add(n.branch(10));   // Add one going right
            nodes.add(n.branch(-10));   // Add one going left
          } else {
            nodes.add(n.branch(int(random(-20,20))));
          }
        } 
        else {
          // leaves.add(new Synapse(b.location));
        }
      }
    }
    
    for (Synapse synapse : leaves) {
       synapse.display(); 
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
}

