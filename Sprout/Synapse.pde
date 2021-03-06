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

  void display() {
    noStroke();
    fill(200,200);
    ellipse(loc.x,loc.y,5,5);   
  }
}

