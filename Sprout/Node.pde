// Growing Neurons
// Alex Norton :: 2015
// https://github.com/alexnortn/Explore.Eye

// Recursive Neuron (w/ ArrayList)

// A class for extending a Neuron with Sum Weighted Forces across nodes

class Node {
  // Each has a location, velocity, and timer 
  PVector start;
  PVector end;
  PVector velocity;
  float   timer;
  float   timerstart;
  int     depth;

  Node    parent;

  ArrayList<Node> children = new ArrayList<Node>();
  ArrayList<Node> adj_list = new ArrayList<Node>();

  PVector[] curve_pts= new PVector[4]; 

  boolean   growing = true;
  boolean leaf = true;
  boolean size = false;
  boolean start_point = false;

  Node (PVector p, PVector v, float n, int d) {
    start = p.get();
    end = p.get();
    velocity = v.get();
    timerstart = n;
    timer = timerstart;
    depth = d;
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
      end.add(velocity);
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

    // Method to update location
  void update() {
    // Update velocity
    velocity.add(acceleration);
    // Limit speed
    velocity.limit(maxspeed);
    location.add(velocity);
    // Reset accelertion to 0 each cycle
    acceleration.mult(0);
  }

  // Simple method to sum forces
  void applyForce(PVector force) {
    acceleration.add(force);
  }

  void wander() {
    float wanderR = 25;         // Radius for our "wander circle"
    float wanderD = 80;         // Distance for our "wander circle"
    float change = 0.3;
    wandertheta += random(-change,change);     // Randomly change wander theta

    // Now we have to calculate the new location to steer towards on the wander circle
    PVector circleloc = velocity.get();    // Start with velocity
    circleloc.normalize();            // Normalize to get heading
    circleloc.mult(wanderD);          // Multiply by distance
    circleloc.add(location);               // Make it relative to boid's location
    
    float h = velocity.heading2D();        // We need to know the heading to offset wandertheta

    PVector circleOffSet = new PVector(wanderR*cos(wandertheta+h),wanderR*sin(wandertheta+h));
    PVector target = PVector.add(circleloc,circleOffSet);
    seek(target);

    // Render wandering circle, etc. 
    if (debug) drawWanderStuff(location,circleloc,target,wanderR);
  }  

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  // Consider using to attract towards another cell or synapse
  void seek(PVector target) {
    PVector desired = PVector.sub(target,location);  // A vector pointing from the location to the target

    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(maxspeed);
    // Steering = Desired minus Velocity
    PVector steer = PVector.sub(desired,velocity);
    steer.limit(maxforce);  // Limit to maximum steering force

    applyForce(steer);
  }

    // Separation
  // Method checks for nearby nodes and steers away
  PVector separate (ArrayList<Node> nodes) {
    float desiredseparation = 25.0f;
    PVector steer = new PVector(0,0,0);
    int count = 0;
    // For every node in the system that is a leaf, check if it's too close
    for (Node other : nodes) {
      if (node.leaf) {
        float d = PVector.dist(location,other.location);
        // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
        if ((d > 0) && (d < desiredseparation)) {
          // Calculate vector pointing away from neighbor
          PVector diff = PVector.sub(location,other.location);
          diff.normalize();
          diff.div(d);        // Weight by distance
          steer.add(diff);
          count++;            // Keep track of how many
        }
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div((float)count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(maxspeed);
      steer.sub(velocity);
      steer.limit(maxforce);
    }
    return steer;
  }

  // We accumulate a new acceleration each time based on three rules
  void expand(ArrayList<Node> nodes) {
    PVector sep = separate(nodes);   // Separation
    PVector ini = this.start;                // Initial Heading
    PVector wan = wander();   // Cohesion
    // Arbitrarily weight these forces
    sep.mult(1.5);
    ini.mult(1.0);
    wan.mult(1.0);
    // Add the force vectors to acceleration
    applyForce(sep);
    applyForce(ini);
    applyForce(wan);
  }

  // Create a new dendrite at the current location, but change direction by a given angle
  Node branch() {
    Node node = new Node(end,velocity,timerstart*0.85f, depth);
    this.addChild(node);
    this.leaf = false;
    // Return a new Node
    return node;
  }

}

