// The Nature of Code
// Daniel Shiffman  
// http://natureofcode.com

// Recursive Tree (w/ ArrayList)

// A class for one dendrite in the system

class Node {
  // Each has a location, velocity, and timer 
  // We could implement this same idea with different data
  PVector start;
  PVector end;
  PVector vel;
  float timer;
  float timerstart;
  boolean size = false;
  int depth;

  Node parent;
  ArrayList<Node> children = new ArrayList<Node>();

  boolean growing = true;
  boolean midpt = false;

  Node(PVector p, PVector v, float n, int l) {
    start = p.get();
    end = p.get();
    vel = v.get();
    timerstart = n;
    timer = timerstart;
    depth = l;
    depth++;
    println(this + " : " + depth);
  }

  void addChild(Node x) {
    x.parent = this;
    this.children.add(x);
  }

  void addParent(Node x) {
    x.addChild(this);
  }

  // Move location
  void update() {
    if (growing) {
      end.add(vel);
    }
  }

  // Draw a dot at location
  void render() {
    // Render fractal lines
    stroke(0);
    line(start.x,start.y,end.x,end.y);
    // Debugging Dots
    fill(100,255,0);
    ellipse(start.x, start.y, 10, 10);
    if (size) {
      fill(255,0,0);
      ellipse(start.x,start.y,5,5);
      fill(0,255,0);
      ellipse(end.x, end.y, 5, 5);
    }
  }


  // Did the timer run out?
  boolean timeToNode() {
    timer--;
    if (timer < 0 && growing) {
      growing = false;
      // Set branch point
      return true;
    } 
    else {
      return false;
    }
  }

  // Create a new dendrite at the current location, but change direction by a given angle
  Node branch(float angle) {
    // What is my current heading
    float theta = vel.heading2D();
    // What is my current speed
    float mag = vel.mag();
    // Turn me
    theta += radians(angle);
    // Look, polar coordinates to cartesian!!
    PVector newvel = new PVector(mag*cos(theta),mag*sin(theta));
    // Return a new Node
    Node node = new Node(end,newvel,timerstart*0.66f, depth);
    this.addChild(node);
    return node;
  }

}

