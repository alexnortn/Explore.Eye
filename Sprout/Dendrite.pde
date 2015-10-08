// The Nature of Code
// Daniel Shiffman  
// http://natureofcode.com

// Recursive Tree (w/ ArrayList)

// A class for one dendrite in the system

class Dendrite {
  // Each has a location, velocity, and timer 
  // We could implement this same idea with different data
  PVector start;
  PVector end;
  PVector vel;
  float timer;
  float timerstart;

  boolean growing = true;

  Dendrite(PVector l, PVector v, float n) {
    start = l.get();
    end = l.get();
    vel = v.get();
    timerstart = n;
    timer = timerstart;
  }

  // Move location
  void update() {
    if (growing) {
      end.add(vel);
    }
  }

  // Draw a dot at location
  void render() {
    stroke(0);
    line(start.x,start.y,end.x,end.y);
  }

  // Did the timer run out?
  boolean timeToDendrite() {
    timer--;
    if (timer < 0 && growing) {
      growing = false;
      return true;
    } 
    else {
      return false;
    }
  }

  // Create a new dendrite at the current location, but change direction by a given angle
  Dendrite dendrite(float angle) {
    // What is my current heading
    float theta = vel.heading2D();
    // What is my current speed
    float mag = vel.mag();
    // Turn me
    theta += radians(angle);
    // Look, polar coordinates to cartesian!!
    PVector newvel = new PVector(mag*cos(theta),mag*sin(theta));
    // Return a new Dendrite
    return new Dendrite(end,newvel,timerstart*0.66f);
  }

}

