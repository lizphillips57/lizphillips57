var canvas;
let rubik;

let currentlyDragging = null;
let words = [];


function windowResized(){
  // Keep the canvas the same width as the window
  resizeCanvas(windowWidth, 400);
}

function preload(){
  rubik = loadFont("RubikMonoOne-Regular.ttf");
}

function setup() {
  canvas = createCanvas(windowWidth, 400);
  canvas.parent("canvas-container");
  
  colorMode(HSL, 360, 100, 100, 100);
  
  words.push(new DraggableWord('L', 100, 100));
  words.push(new DraggableWord('I', 175, 100));
  words.push(new DraggableWord('Z', 250, 100));
  
  words.push(new DraggableWord('P', 100, 200));
  words.push(new DraggableWord('H', 175, 200));
  words.push(new DraggableWord('I', 250, 200));
  words.push(new DraggableWord('L', 325, 200));
  words.push(new DraggableWord('L', 400, 200));
  words.push(new DraggableWord('I', 475, 200));
  words.push(new DraggableWord('P', 550, 200));
  words.push(new DraggableWord('S', 625, 200));

}

function draw() {
  
  // Makes trails fade
  // erase(5);
  // rect(0,0,width,height);
  // noErase();
  
  //background(5);
  //clear();
  noStroke();
  //fill(100);
  textSize(32);
  textFont(rubik);
  
  //circle(width / 2, height / 2, 50);
  
  for (let word of words) {
    word.display();
  }
  
  // Makes text not fuzzy  
  erase();
  rect(0, height-15, 80, height-15);
  noErase();
  
  push();
  textSize(15);
  textFont("Helvetica");
  text("Clear trails", 0, height);
  pop();
}

/*


BUILT-IN FUNCTIONS


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
  
  if (mouseX < 80 && mouseX > 0 && mouseY < height && mouseY > height-15){
    // Clear trails
    clear();
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
    
    this.textCenterX = textWidth(this.word) /2;
    this.textCenterY = textAscent() /2;
    
    // Draw a circle    
    fill(100, 50, 60);
    if (this.dragging){ // change color if dragging it!
      let h = random(200, 300);
      fill(h,50,60,20);
    }
    
    circle(this.x + this.textCenterX, this.y - this.textCenterY, 50);
    
    // Draw the text
    fill(100);
    text(this.word, this.x, this.y);
    
  }
  
  isMouseOver() {
    // Detects if the mouse is within the bounding box of the word.
    let textWidthSize = textWidth(this.word);
    let textHeightSize = textAscent();
    
    // The below will return a boolean. True if all the conditions are met.
    return (mouseX >= this.x && 
            mouseX <= this.x + textWidthSize &&
            mouseY >= this.y - textHeightSize && 
            mouseY <= this.y);
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
      // Make sure to account for the offset!
      this.x = mouseX - this.offsetX;
      this.y = mouseY - this.offsetY;
    }
  }
  
  stopDrag() {
    // Update dragging status
    this.dragging = false;
  }
}
