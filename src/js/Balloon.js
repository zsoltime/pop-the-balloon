'use strict';
function Balloon(x, y, wind) {
  this.pos = createVector(x, y);
  this.vel = createVector(0, random(-7, -3));
  this.acc = createVector(random(-1 * wind, wind), -0.1);
  this.width = Math.floor((random(60, 100))); // should it be smaller on smaller screens?
  this.height = this.width * 1.35;

  // these should not be here...
  this.colors = {};
  this.colors.amber = color(255, 195, 7, 245);
  this.colors.blue = color(35, 100, 200, 245);
  this.colors.green = color(35, 150, 35, 245);
  this.colors.purple = color(135, 50, 135, 245);
  this.colors.red = color(220, 50, 50, 245);

  this.colorName = random() > 0.5 ? targetColor : random(colors);

  this.color = this.colors[this.colorName];

  this.update = function() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  this.show = function() {
    stroke('grey');
    strokeWeight(2);
    noFill();
    line(
      this.pos.x, this.pos.y + this.height / 2,
      this.pos.x, this.pos.y + this.height / 2 + 20);

    noStroke();
    fill(this.color);

    triangle(
      this.pos.x - 6, this.pos.y + this.height / 2 + 8,
      this.pos.x, this.pos.y - 3 + this.height / 2,
      this.pos.x + 6, this.pos.y + this.height / 2 + 8);
    ellipse(this.pos.x, this.pos.y, this.width, this.height);

    fill(255, 255, 255, 15);

    ellipse(
      this.pos.x - this.width / 5,
      this.pos.y + this.height / 2 - Math.floor(this.height / 1.6),
      this.width / 2.5,
      this.height / 1.8
    );
  }

  this.isOffCanvas = function() {
    // should also check pos.x now with the added wind
    return (this.pos.y + this.height / 2 < 0)
  }

	this.pop = function() {
    //@todo also check if it's on the canvas and not the statusbar
 		return (mouseX > (this.pos.x - (this.width / 2)) &&
            mouseX < (this.pos.x + (this.width / 2)) &&
            mouseY > (this.pos.y - (this.height / 2)) &&
            mouseY < (this.pos.y + (this.height / 2)));
	}
}
