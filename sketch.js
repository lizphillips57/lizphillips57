/*
Liz Phillips
Newton's Cradle wordmark
Last modified: 9/10/24

*/

var canvas;
let rubik;
let centerX, centerY, ballRadius;

let currentlyDragging = null;
let words = [];
let threads = [];

function windowResized(){
  // Keep the canvas the same width as the window
  resizeCanvas(windowWidth, 200);
}

function preload(){
  rubik = loadFont("/fonts/RubikMonoOne-Regular.ttf");
}

function setup() {
  canvas = createCanvas(windowWidth, 200);
  canvas.parent("canvas-container");
  colorMode(HSL, 360, 100, 100, 100);
  textAlign(CENTER, CENTER);
  
  centerX = width/2;
  centerY = height/2;
  ballRadius = (width * 2/3) / 8;
  
  words.push(new DraggableWord('L', centerX-ballRadius, centerY));
  words.push(new DraggableWord('I', centerX, centerY));
  words.push(new DraggableWord('Z', centerX+ballRadius, centerY));
  
  for (let w of words){
    threads.push(new Thread(w.x, w.y));
  }
  
  // words.push(new DraggableWord('P', 100, 200));
  // words.push(new DraggableWord('H', 175, 200));
  // words.push(new DraggableWord('I', 250, 200));
  // words.push(new DraggableWord('L', 325, 200));
  // words.push(new DraggableWord('L', 400, 200));
  // words.push(new DraggableWord('I', 475, 200));
  // words.push(new DraggableWord('P', 550, 200));
  // words.push(new DraggableWord('S', 625, 200));

}

/*

DRAW

*/

function draw() {
  background(20);
  noStroke();
  textSize(ballRadius/2);
  textFont(rubik);
  
  for (let t of threads){
    t.display();
  }
  
  for (let word of words) {
    word.display();
    
    stroke(0);
    point(word.x, word.y);
    noStroke();
  }
}

/*


MOUSE EVENTS


*/

// Check if any word is clicked or not
function mousePressed() {
  
  let outsideCounter = 0;
  
  for (let word of words) {
    // Looping through an array of DraggableWords
    
    if (word.isMouseOver()) {
      // currentlyDragging can only point to one word at a time.
      // (It is NOT copying the object. Just pointing to it.)
      // We need this in order to keep track of the current word outside of this for loop.
      currentlyDragging = word;
      
      word.startDrag();
      break; // We don't need to continue checking the rest of the words
    }else{
      // the mouse is not over this word...
      outsideCounter++;
    }
    
  }
  if (outsideCounter == words.length && mouseX <= width && mouseY <= height){
    // the mouse is not over ANY words!
    //clear();
  }
  
}

function mouseDragged() {
  if (currentlyDragging) { // will be truthy if it points to anything, falsy if null
    currentlyDragging.drag();
  }
}

function mouseReleased() {
  if (currentlyDragging) {
    currentlyDragging.stopDrag();
    currentlyDragging = null; // reset to null, no longer points to anything.
  }
}

/*


CLASSES


*/

class DraggableWord {
  constructor(word, x, y) {
    this.word = word;
    this.x = x; // initial position
    this.y = y;
    this.dragging = false; // keep track of dragging state
    this.offsetX = 0; // Where the clicked mouse is, relative to the word's position.
    this.offsetY = 0;
    
  }
  
  display() {
    
    // Draw a circle    
    fill(100, 50, 60);
    if (this.dragging){ // change color if dragging it!
      fill(250,50,60);
    }
    
    circle(this.x, this.y, ballRadius);
    
    // Draw the text
    fill(100);
    text(this.word, this.x, this.y);
    
  }
  
  isMouseOver() {
    // Detects if the mouse is within the circle
    let mouse = createVector(mouseX, mouseY);
    let ballCenter = createVector(this.x, this.y);
    let distance = mouse.dist(ballCenter);
    
    return distance<ballRadius;
  }
  
  startDrag() {
    // Update dragging status
    this.dragging = true;
    // Where the mouse has clicked, relative to the word's position.
    // This is necesary so the word appears to be dragged under the mouse,
    // and not just snapped to the cursor.
    this.offsetX = mouseX - this.x;
    this.offsetY = mouseY - this.y;
  }
  
  drag() {
    if (this.dragging) {
      // Change the word's position to match the mouse's position.
      // Make sure to account for the offset (where you clicked)

      if(mouseX<0){ this.x = -this.offsetX;}
      else if(mouseX>width){ this.x = width-this.offsetX;}
      else{ this.x = mouseX - this.offsetX;}
      
      if(mouseY<0){ this.y = -this.offsetY;}
      else if(mouseY>height){ this.y = height-this.offsetY;}
      else{ this.y = mouseY - this.offsetY;}
      
      
    }
  }
  
  stopDrag() {
    // Update dragging status
    this.dragging = false;
  }
}

class Thread{
  constructor(x, y){
    this.bottomX = x;
    this.bottomY = y;
    this.topX = x;
    this.topY = y-70;
  }
  display(){
    push();
    stroke(100);
    line(this.bottomX, this.bottomY, this.topX, this.topY);
    pop();
  }
}
