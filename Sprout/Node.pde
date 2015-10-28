// Growing Neurons
// Alex Norton :: 2015
// https://github.com/alexnortn/Explore.Eye

// Recursive Neuron (w/ ArrayList)

// A class for extending a Neuron with Sum Weighted Forces across nodes

class Node {
  // Each has a location, velocity, and timer 
  PVector start,
          location,
          velocity,
          acceleration;
  float   r,
          wandertheta,
          maxforce,    // Maximum steering force
          maxspeed,    // Maximum speed
          inimult,     // Initial offset multiplier
          sepmult,     // Separation multiplier
          timer,
          timerstart,
          wan_const;
  int     max_depth,
          depth;

  Node    parent;

  ArrayList<Node> children = new ArrayList<Node>();
  ArrayList<Node> adj_list = new ArrayList<Node>();

  PVector[] curve_pts= new PVector[4]; 

  boolean growing = true;
  boolean leaf = true;
  boolean size = false;
  boolean start_point = false;
  boolean dw = true;

  Node (PVector p, PVector v, float n, int d, int mxd) {
    start = p.get();
    location = p.get();
    velocity = v.get();
    acceleration = new PVector(0,0);
    r = 6;
    wandertheta = 0;
    wan_const = 1.0;
    maxspeed = 1.5;       // Default 2
    maxforce = random(0.8,1);    // Default 0.05
    timerstart = n;
    timer = timerstart;
    max_depth = mxd;
    depth = d;
    depth++;
  }

  void addChild(Node x) {
    x.parent = this;
    this.children.add(x);
  } 

  void addParent(Node x) {
    x.addChild(this);
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
      return p_2.set(this.location.x,this.location.y);
  }
  PVector pt_3() {
    PVector p_3 = new PVector();
    if (this.children.size() == 0) {
      // If we're at the location, create a random vector
      // println("0");
      return p_3.random2D();
    } else {
      if (this.children.size()==1){
        // println("1");
        return p_3.set(this.children.get(0).location.x,this.children.get(0).location.y);
      } else if (this.children.size()>1) {
          for(int i=0; i<this.children.size(); i++) {
            p_3.add(this.children.get(i).location);
          }
          // println("2");
          p_3.div(children.size());
          return p_3;
      } else {
        // println("3");
        return p_3.set(this.location.x,this.location.y);
      }
    }
  }

  PVector wander() {
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
    
    // Render wandering circle, etc. 
    if(dw) drawWanderStuff(location,circleloc,target,wanderR);
    
    return seek(target);

  }

  // A method just to draw the circle associated with wandering
  void drawWanderStuff(PVector location, PVector circle, PVector target, float rad) {
    stroke(100); 
    noFill();
    ellipseMode(CENTER);
    ellipse(circle.x,circle.y,rad*2,rad*2);
    ellipse(target.x,target.y,4,4);
    line(location.x,location.y,circle.x,circle.y);
    line(circle.x,circle.y,target.x,target.y);
  }  

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  // Consider using to attract towards another cell or synapse
  PVector seek(PVector target) {
    PVector desired = PVector.sub(target,location);  // A vector pointing from the location to the target
    // float angle = degrees(desired.heading());
    // println(angle);
    // inimult =  map(angle,0,180,0,5);  

    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(maxspeed);
    // Steering = Desired minus Velocity
    PVector steer = PVector.sub(desired,velocity);
    steer.limit(maxforce);  // Limit to maximum steering force

    return steer;
  }

  // Separation
  // Method checks for nearby nodes and steers away
  PVector separate (ArrayList<Node> nodes) {
    float desiredseparation = 50.0f;
    PVector steer = new PVector(0,0,0);
    int count = 0;
    // For every node in the system that is a leaf, check if it's too close
    for (Node other : nodes) {
      // if (other.leaf) {
        float d = PVector.dist(location,other.location);
        // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
        if ((d > 0) && (d < desiredseparation)) {
          // Calculate vector pointing away from neighbor
          PVector diff = PVector.sub(location,other.location);
          diff.normalize();
          diff.div(d*d);        // Weight by distance
          sepmult = map((1/(d*d)),0,1,0,5);     // Proportional to Inverse Distance Squared
          steer.add(diff);
          count++;              // Keep track of how many
        }
      // }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
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

  // Simple method to sum forces
  void applyForce(PVector force) {
    acceleration.add(force);
  }

  // We accumulate a new acceleration each time based on three rules
  void expand(ArrayList<Node> nodes) {
    PVector sep = separate(nodes);      // Separation
    PVector ini = seek(findRoot(this)).mult(-1); // Root Node (multiply by -1 to repel)
    PVector wan = wander();             // Wander
    // Arbitrarily weight these forces
    sep.mult(1.0);
    ini.mult(1.5);
    wan.mult(wan_const);
    // Add the force vectors to acceleration
    applyForce(sep);
    applyForce(ini);
    applyForce(wan);
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

  // Draw a dot at location
  void render() {
    // Basic Fractal Lines
    stroke(200);
    noFill();
    // line(start.x,start.y,location.x,location.y);
    // Render Curves
    curve(pt_0().x,pt_0().y,pt_1().x,pt_1().y,pt_2().x,pt_2().y,pt_2().x,pt_2().y);
    // Render Path Home
    if (size) {
      noStroke();
      fill(200,0,0);
      ellipse(start.x,start.y,5,5);
      ellipse(location.x, location.y, 5, 5);
    }
    if (start_point) {
      noStroke();
      fill(200,0,0);
      ellipse(location.x, location.y, 5, 5);
    }
    // Draw Soma
    pushStyle();
      fill(200);
      if (depth == 2) ellipse(start.x,start.y,25,25);
    popStyle();
    // Debug Neighborhood
    pushStyle();
      noStroke();
      fill(255,10);
      ellipse(location.x,location.y,50,50);
      fill(255,255);
    popStyle();
  }

  void run(ArrayList<Node> nodes) {
    if (growing) {
      expand(nodes);
      update();
    }
    render();
  }

  // Recurse through nodes to root
  PVector findRoot(Node n) {
    if(n.parent == null) {
      return n.location;
    }
    else {
      return findRoot(n.parent);
    }
  }

  // Calc T(--)
  int sub_t(int mxd) {
    int tt = int(mxd / 1.5);
    return tt;
  }

  // Did the timer run out?
  boolean timeToNode() {
    if ((depth == 2)||(depth == 3)) {
      timer -= int(random(2,sub_t(max_depth)));
    } else {
      timer--;
    }
    // Make leaves go crazy on final level
    if (depth == (max_depth-2)) wan_const = 3;
    if (timer < 0 && growing) {
      // Display Wandering Debug
      dw = false;
      growing = false;
      // Set branch point
      return true;
    } 
    else {
      return false;
    }
  }


  //  // Did the timer run out?
  // boolean timeToNode() {
  //   if ((depth == 2)||(depth == 3)) {
  //     int time_constant = int((this.depth / 2)
  //     timer -= time_constant;
  //   } else {
  //     timer--;
  //   }
  //   if (timer < 0 && growing) {
  //     // Display Wandering Debug
  //     dw = false;
  //     growing = false;
  //     // Set branch point
  //     return true;
  //   } 
  //   else {
  //     return false;
  //   }
  // }

  // Create a new dendrite at the current location, but change direction by a given angle
  Node branch(float angle) {
    // What is my current heading
    float theta = velocity.heading2D();
    // What is my current speed
    float mag = velocity.mag();
    // Turn me
    theta += radians(angle);
    // Polar coordinates to cartesian!!
    PVector newvel = new PVector(mag*cos(theta),mag*sin(theta));
    Node node = new Node(location,newvel,timerstart*random(0.8,0.85f), depth, max_depth);
    this.addChild(node);
    this.leaf = false;
    // Return a new Node
    return node;
  }

}

