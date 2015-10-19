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
  int depth;

  Node parent;
  ArrayList<Node> children = new ArrayList<Node>();
  ArrayList<Node> adj_list = new ArrayList<Node>();

  PVector[] curve_pts= new PVector[4]; 

  boolean growing = true;
  boolean leaf = true;
  boolean size = false;
  boolean start_point = false;

  Node(PVector p, PVector v, float n, int l) {
    start = p.get();
    end = p.get();
    vel = v.get();
    timerstart = n;
    timer = timerstart;
    depth = l;
    depth++;
    // println(this + " : " + depth);
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

  // Set curve points
  PVector pt_0() {
    PVector p_0 = new PVector();
    if (this.parent.parent == null) {
      p_0 = this.start.get();       
      return p_0;
    } else {
      return p_0.set(this.parent.start.x,this.parent.start.y);
    }
  }
  PVector pt_1() {
    PVector p_1 = new PVector();
      return p_1.set(this.start.x,this.start.y);
  }
    PVector pt_2() {
    PVector p_2 = new PVector();
      return p_2.set(this.end.x,this.end.y);
  }
  PVector pt_3() {
    PVector p_3 = new PVector();
    if (this.leaf) {
      // If we're at the end, create a random vector
      // println("0");
      return p_3.random2D();
    } else {
      if (this.children.size()==1){
        // println("1");
        return p_3.set(this.children.get(0).end.x,this.children.get(0).end.y);
      } else if (this.children.size()>1) {
          for(int i=0; i<this.children.size(); i++) {
            p_3.add(this.children.get(i).end);
          }
          // println("2");
          p_3.div(children.size());
          return p_3;
      } else {
        // println("3");
        return p_3.set(this.end.x,this.end.y);
      }
    }
  }

  // Draw a dot at location
  void render() {
    // Basic Fractal Lines
    stroke(0);
    noFill();
    // line(start.x,start.y,end.x,end.y);
    // Render Curves
    curve(pt_0().x,pt_0().y,pt_1().x,pt_1().y,pt_2().x,pt_2().y,pt_2().x,pt_2().y);
    if (size) {
      fill(255,0,0);
      ellipse(start.x,start.y,15,15);
      fill(0,255,0);
      ellipse(end.x, end.y, 15, 15);
    }
    if (start_point) {
      fill(0,0,0);
      ellipse(end.x, end.y, 15, 15);
    }
  }


  // Did the timer run out?
  boolean timeToNode() {
    if ((depth == 2)||(depth == 3)) {
      timer -= 2;
    } else {
      timer--;
    }
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
    Node node = new Node(end,newvel,timerstart*0.85f, depth);
    this.addChild(node);
    this.leaf = false;
    return node;
  }

}

