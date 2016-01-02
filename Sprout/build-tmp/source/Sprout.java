import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import processing.pdf.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class Sprout extends PApplet {

// Growing Neurons
// Alex Norton :: 2015
// https://github.com/alexnortn/Explore.Eye

// Recursive Neuron (w/ ArrayList)


// Import PDF Export



Nnn nnn;
int counter = 0;
int mxn = 0;
int avg = 0;
int all_nodes = 0;
boolean record = false;
boolean frame = false;
boolean loop = true;

public void setup() {
  // size(1000,800);
  
  // background(25);
  // frameRate(15);
  noCursor();

  // Initialize the nnn with args[0] = neuron amount, args[1] = general complexity
  nnn = new Nnn(1, 13);
  nnn.initialize();

  // Record PDF
  String pdf = "Neuron_Itr: " + str(counter);
  if (record) beginRecord(PDF, pdf+".pdf"); 

}

public void draw() {
  background(25);
  // Run the nnn
  nnn.run();
  // Display meta data
  meta(nnn.neurons.get(0));

  // plus_minus();
  iterate();
  if(frame) saveFrame(counter + ":sprout-######.tga");

  // Exit after 100 iterations
  exit_sprout();
}

public void plus_minus() {
  if (frameCount % 120 == 0) {
    nnn.rmv_neuron(1);
    nnn.add_neuron(1);
    recurse();
  }
}

public void exit_sprout() {
	if (counter > 100) exit();
}

public void iterate() {
  if (frameCount % 360 == 0) {
    if(record) endRecord();
    avg = avg_node(nnn.neurons.get(0));
    setup();
    counter++;
  }
}

public void recurse() {
  Neuron neuron = nnn.neurons.get(PApplet.parseInt(random(nnn.neurons.size())));
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

// Quick Max Calc
public int max_node(Neuron n) {
  if (n.nodes.size() > mxn) mxn = n.nodes.size();
    return mxn;
}

// Quick Avg Calc
public int avg_node(Neuron n) {
  all_nodes += n.nodes.size();
  avg = PApplet.parseInt(all_nodes / (counter+1));
  return avg;
}

// Simulation Results
public void meta(Neuron n) {
  // Make fonts
  PFont whitney;
  whitney = createFont("WhitneyHTF-BoldSC.otf", 18);
  PFont whitney_m;
  whitney_m = createFont("WhitneyHTF-Medium.otf", 12);
  // Make meta
  String[] meta_name = new String[7];
  String[] meta_value = new String[7];
    meta_value[0] = str(counter);               // Number of Interations
    meta_value[1] = str(n.neuron_timer);        // Neuron Timer
    meta_value[2] = str(n.max_depth);           // Max Depth
    meta_value[3] = str(n.num_branches);        // Number of Branches
    meta_value[4] = str(n.nodes.size());        // Node Size
    meta_value[5] = str(max_node(n));           // Max Node Size
    meta_value[6] = str(avg);           // Avg Node Size
    meta_name[0] = "neuron interation:";
    meta_name[1] = "timer:";
    meta_name[2] = "max depth:";
    meta_name[3] = "branch count:";
    meta_name[4] = "node count:";
    meta_name[5] = "max node count:";
    meta_name[6] = "avg node count:";
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

public void keyPressed() {
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
      loop = !loop;

      if (loop) {
        noLoop();
      } else {
        loop();
      }
    }
  }          
}

public void mousePressed() {
  PVector mousePos = new PVector(mouseX, mouseY);
  nnn.add_neuronn(mousePos);
}


// Growing Neurons
// Alex Norton :: 2015
// https://github.com/alexnortn/Explore.Eye

// Recursive Neuron (w/ ArrayList)

// A class for controlling the interactions across the enire network

class Nnn {
  int num_neurons;
	int complexity;
	ArrayList<Neuron> neurons;
	PVector neuron_position;

  Nnn (int nc, int cp) {
  	num_neurons = nc;
  	complexity = cp;
    neurons = new ArrayList<Neuron>();
  }

  public void initialize() {
  	for (int i=0; i < num_neurons; i++) {
	    neuron_position = new PVector(width/2,height/2);
	    // Create Neurons with similar general levels of complexity
	    int branches = PApplet.parseInt(random(6,9));
	    int depth = complexity - branches;
	    // Given a constant branching speed, this controls neuron size, does not effect morphology
	    // Grow time is inversely proportional to branches
	    float neuron_time = 400/branches;
	    // Initialize array of Neuron objects
	    neurons.add(new Neuron(neuron_position, branches, neuron_time, depth));
	    neurons.get(i).neuron_setup();
	  }
  }
  // Simple method for running the neurons
  public void run() {
  	for (Neuron neuron: neurons) {
    	neuron.update();
  	}
  }

  // Add neuron to the network
  public void add_neuron(int count) {
    for (int i=0; i < count; i++) {
	    neuron_position = new PVector(random(width),random(height));
	    int branches = PApplet.parseInt(random(7,12));
	    float neuron_time = random(10,40);
	    int depth = PApplet.parseInt(random(5,12));
	    // Initialize array of Neuron objects
	    neurons.add(new Neuron(neuron_position, branches, neuron_time, depth));
	    neurons.get(neurons.size()-1).neuron_setup(); 
	    println("neurons.size: "+neurons.size());
	  }
  }

  // Add neuron to the network
  public void add_neuronn(PVector pos) {
    neuron_position = new PVector(pos.x,pos.y);
    int branches = PApplet.parseInt(random(7,12));
    float neuron_time = random(10,40);
    int depth = PApplet.parseInt(random(5,12));
    neurons.add(new Neuron(neuron_position, branches, neuron_time, depth));
    neurons.get(neurons.size()-1).neuron_setup(); 
    println("neurons.size: "+neurons.size());
	}

   // Remove neuron to the network
  public void rmv_neuron(int count) {
    for (int i=0; i < count; i++) {
	    int j = PApplet.parseInt(random(neurons.size()));
	    neurons.remove(j);
	  }
  }

}
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Recursive Tree (w/ ArrayList)

// A class for a leaf that gets placed at the location of 
// the last branches

class Neuron {

  PVector location;
  float   neuron_timer;
  int     max_depth,
		  num_branches;

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

  public void neuron_setup() {
	PVector start_velocity = new PVector(2,2); // Change this value to determine simulation speed
	Node n = new Node(this.location, start_velocity, this.neuron_timer, 0, this.max_depth);
	// Add to arraylist
	nodes.add(n); 
	float theta = TWO_PI / num_branches;  
	// Random rotational offset constant
	float theta_const = random(TWO_PI); 
	// Create seed dendritees
	for (int i = 0; i < num_branches; i++) {
	  float start_angle = (theta * i) + radians(random(-15,15)) + theta_const;
	  float x = sin(start_angle);
	  float y = cos(start_angle);
	  // Branch a bunch of times
	  nodes.add(n.branch(degrees(start_angle)));
	  // nodes.add(n.branch());
	}
  }

  public void update() {
	// Let's stop when the neuron gets too deep
	// For every dendrite in the arraylist
	for (int i = nodes.size()-1; i >= 1; i--) {
	  // Get the dendrite, update and draw it
	  Node n = nodes.get(i);
	  n.run(nodes);
	  // If it's ready to split
	  if (n.timeToNode()) {
		if (n.depth < this.max_depth ) {
		  if (((n.depth+1) % 2 == 0) && (n.depth != 2)) {
			//neuron.remove(i);             // Delete it
			nodes.add(n.branch(10));   // Add one going right
			nodes.add(n.branch(-10));   // Add one going left
		  } 
		  else {
			// Additional method for probabalistic branching
			float rnd = random(1);
			if ((rnd < 0.15f) && ((n.depth + 1) < this.max_depth )) {
			  nodes.add(n.branch(10));   // Add one going right
			  nodes.add(n.branch(-10));   // Add one going left
			} else {
			  nodes.add(n.branch(PApplet.parseInt(random(-20,20))));
			} 
		  }
		} 
		else {
		  leaves.add(new Synapse(n.location));
		}
	  }
	}
	
	for (Synapse synapse : leaves) {
	   synapse.display(); 
	}
  }

  // Recurse through nodes to root
  public ArrayList<Node> recurseMore(Node n, ArrayList<Node> p) {
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

  public ArrayList<Node> adj(Node n) {
	ArrayList<Node> path = new ArrayList<Node>();
	n.start_point = true;
	recurseMore(n, path);
	return path;
  }
}

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
    wan_const = 1.0f;
    maxspeed = 1.5f;       // Default 2
    maxforce = random(0.8f,1);    // Default 0.05
    timerstart = n;
    timer = timerstart;
    max_depth = mxd;
    depth = d;
    depth++;
  }

  public void addChild(Node x) {
    x.parent = this;
    this.children.add(x);
  } 

  public void addParent(Node x) {
    x.addChild(this);
  }

  // Set curve points
  public PVector pt_0() {
    PVector p_0 = new PVector();

    if (this.parent.parent == null) {
      p_0 = this.start.get();       
      return p_0;
    } else {
      return p_0.set(this.parent.start.x,this.parent.start.y);
    }
  }
  public PVector pt_1() {
    PVector p_1 = new PVector();
      return p_1.set(this.start.x,this.start.y);
  }
    public PVector pt_2() {
    PVector p_2 = new PVector();
      return p_2.set(this.location.x,this.location.y);
  }
  public PVector pt_3() {
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

  public PVector wander() {
    float wanderR = 25;         // Radius for our "wander circle"
    float wanderD = 80;         // Distance for our "wander circle"
    float change = 0.3f;
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
  public void drawWanderStuff(PVector location, PVector circle, PVector target, float rad) {
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
  public PVector seek(PVector target) {
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
  public PVector separate (ArrayList<Node> nodes) {
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
  public void applyForce(PVector force) {
    acceleration.add(force);
  }

  // We accumulate a new acceleration each time based on three rules
  public void expand(ArrayList<Node> nodes) {
    PVector sep = separate(nodes);      // Separation
    PVector ini = seek(findRoot(this)).mult(-1); // Root Node (multiply by -1 to repel)
    PVector wan = wander();             // Wander
    // Arbitrarily weight these forces
    sep.mult(1.0f);
    ini.mult(1.5f);
    wan.mult(wan_const);
    // Add the force vectors to acceleration
    applyForce(sep);
    applyForce(ini);
    applyForce(wan);
  }

  // Method to update location
  public void update() {
    // Update velocity
    velocity.add(acceleration);
    // Limit speed
    velocity.limit(maxspeed);
    location.add(velocity);
    // Reset accelertion to 0 each cycle
    acceleration.mult(0);
  }

  // Draw a dot at location
  public void render() {
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

  public void run(ArrayList<Node> nodes) {
    if (growing) {
      expand(nodes);
      update();
    }
    render();
  }

  // Recurse through nodes to root
  public PVector findRoot(Node n) {
    if(n.parent == null) {
      return n.location;
    }
    else {
      return findRoot(n.parent);
    }
  }

  // Calc T(--)
  public int sub_t(int mxd) {
    int tt = PApplet.parseInt(mxd / 1.5f);
    return tt;
  }

  // Did the timer run out?
  public boolean timeToNode() {
    if ((depth == 2)||(depth == 3)) {
      timer -= PApplet.parseInt(random(2,sub_t(max_depth)));
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
  public Node branch(float angle) {
    // What is my current heading
    float theta = velocity.heading2D();
    // What is my current speed
    float mag = velocity.mag();
    // Turn me
    theta += radians(angle);
    // Polar coordinates to cartesian!!
    PVector newvel = new PVector(mag*cos(theta),mag*sin(theta));
    Node node = new Node(location,newvel,timerstart*random(0.8f,0.85f), depth, max_depth);
    this.addChild(node);
    this.leaf = false;
    // Return a new Node
    return node;
  }

}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Recursive Tree (w/ ArrayList)

// A class for a leaf that gets placed at the location of 
// the last branches

class Synapse {
  PVector loc;

  Synapse(PVector l) {
    loc = l.get();
  }

  public void display() {
    noStroke();
    fill(200,200);
    ellipse(loc.x,loc.y,5,5);   
  }
}

  public void settings() {  fullScreen(); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "Sprout" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
