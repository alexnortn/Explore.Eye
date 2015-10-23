// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Recursive Tree (w/ ArrayList)

// A class for a leaf that gets placed at the location of 
// the last branches

// Contructor: P5.Vector
function Synapse(l) {
	this.loc = l.copy();
	// Method to display the leaves :: "Boutons"
	// Should be improved to stochastically distribute the boutons along
	// the length of 'distal' zone --> Monte Carlo
	function display() {
		p.noStroke();
		p.fill(200,200);
		p.ellipse(loc.x,loc.y,5,5);   
	}
}

