// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Recursive neuron (w/ ArrayList)
// Nature of Code, Chapter 8

// Recursive dendriteing "structure" without an explicitly recursive function
// Instead we have an ArrayList to hold onto N number of elements
// For every element in the ArrayList, we add 2 more elements, etc. (this is the recursion)

// An arraylist that will keep track of all current dendritees
ArrayList<Dendrite> neuron;
// ArrayList<Dendrite> ;
ArrayList<Leaf> leaves;

void setup() {
  // size(640,360);
  fullScreen();
  background(255);
  // Setup the arraylist and add one dendrite to it
  neuron = new ArrayList<Dendrite>();
  leaves = new ArrayList<Leaf>();
  // A dendrite has a starting location, a starting "velocity", and a starting "timer"
  float theta = TWO_PI;
  int num_dendritees = int(random(5,8));
  float offset = theta / num_dendritees;  
  // Create seed dendritees
  for(int i = 0; i < num_dendritees; i++) {
    float start_angle = (offset * i) + radians(random(-10,10));
    float x = sin(start_angle);
    float y = cos(start_angle);
    Dendrite b = new Dendrite(new PVector(width/2,height/2),new PVector(x,y),50);
    // Add to arraylist
    neuron.add(b); 
  }
}

void draw() {
  background(255);

  // Let's stop when the arraylist gets too big
  // For every dendrite in the arraylist
  for (int i = neuron.size()-1; i >= 0; i--) {
    // Get the dendrite, update and draw it
    Dendrite b = neuron.get(i);
    b.update();
    b.render();
    // If it's ready to split
    if (b.timeToDendrite()) {
      if (neuron.size() < 512) {
        //neuron.remove(i);             // Delete it
        neuron.add(b.dendrite(30));   // Add one going right
        neuron.add(b.dendrite(-30));   // Add one going left
      } 
      else {
        leaves.add(new Leaf(b.end));
      }
    }
  }
  
  for (Leaf leaf : leaves) {
     leaf.display(); 
  }

}

void keyPressed() {
  if(keyCode == TAB) setup();
}




