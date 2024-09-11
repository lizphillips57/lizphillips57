/* 

Typewriter v3
Liz Phillips
MAT 111WN

TO-DO: buttons

*/

let dialogueIndex = 0; // Which character line are you on?
let typewriters = []; // Typewriter objects get added to this as they are created.
let dialogues = []; // Each character line gets their own 'text' and 'style' properties.
let vw, vh, padding, boxWidth; // Viewport-dependent
let cStyle, jStyle; // Predefined styles

let scrollOffset = 0; // Variable to track the vertical scroll
let targetScrollOffset = 0; // Target offset for smooth scrolling
let maxScrollOffset = 0; // Maximum scroll limit

function preload() {
  font = loadFont("/fonts/KodeMono-VariableFont_wght.ttf");
}

function windowResized(){
  // Keep the canvas the same width as the window
  resizeCanvas(windowWidth, windowHeight);
}

/*

                    SETUP

*/

function setup() {
  createCanvas(windowWidth, windowHeight);
  textWrap(WORD);
  textAlign(LEFT, TOP);
  textFont(font);
  
  // 1% viewport, for adjusting text size, etc.
  vw = 0.01 * windowWidth;
  vh = 0.01 * windowHeight;
  padding = 10*vw;
  boxWidth = windowWidth - 2*padding;
  
  // Predefined styles
  cStyle = { color: color(255, 150, 0), size: 3*vh, speed: 1 };
  jStyle = { color: color(100, 100, 255), size: 3*vh, speed: 20 };
  
  // Array of dialogue objects, each with their own text and style properties
  dialogues = [
    {
      text: "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness.",
      style: cStyle
    },
    {
      text: "No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.",
      style: jStyle
    },
    {
      text: "Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure.",
      style: cStyle
    },
    {
      text: "To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it?",
      style: jStyle
    },
    {
      text: "But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?",
      style: cStyle
    },
    {
      text: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue.",
      style: cStyle
    },
    {
      text: "And equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain.",
      style: jStyle
    }
  ];

  // Create the first Typewriter object with the first dialogue
  let firstDialogue = dialogues[dialogueIndex];
  typewriters.push(createTypewriter(firstDialogue.text, padding, padding, firstDialogue.style));
}

/*

                    DRAW

*/

function draw() {
  background(20);
  
  // Apply smooth scrolling using lerp to ease into the targetScrollOffset
  scrollOffset = lerp(scrollOffset, targetScrollOffset, 0.2);

  push();
  translate(0, -scrollOffset); // Move canvas up to simulate scrolling

  // Loop through all Typewriter objects, update and display
  for (let tw of typewriters) {
    tw.update();
    tw.display();
  }
  pop();
}

/*

                    MOUSE FUNCTIONS

*/

function mousePressed() {
  
  // Get the latest Typewriter object
  let currentTypewriter = typewriters[typewriters.length - 1];
  
  // If the current line is fully typed...
  if (currentTypewriter.typingFinished) {
    if (dialogueIndex < dialogues.length - 1) { // If the current dialogue is not the final...
      
      // ...then advance to the next dialogue
      dialogueIndex++;
      
      let nextDialogue = dialogues[dialogueIndex];
      
      // Compute y position for the next Typewriter based on height of currentTypewriter
      let yPosition = currentTypewriter.y + currentTypewriter.textHeight + 20; // 20 pixels padding

      // Create a new Typewriter object with the next dialogue's text and style
      typewriters.push(createTypewriter(nextDialogue.text, padding, yPosition, nextDialogue.style));
      
      // If the new text is below the bounding area, adjust the scroll target
      let endY = yPosition + currentTypewriter.textHeight;
      let bottomPadding = windowHeight - padding;
      if (endY > bottomPadding + scrollOffset) {
        targetScrollOffset = endY - bottomPadding;
      }
      
      // Update maxScrollOffset to reflect new content height
      maxScrollOffset = endY - bottomPadding;
      
    }else{ // If the current dialogue is the final...
      // Advance to next page????
      print("Next page!");
    }
    
  } else { // If the current line isn't fully typed, complete it instantly
    currentTypewriter.index = currentTypewriter.text.length;
    currentTypewriter.typingFinished = true;
  }
}

function mouseWheel(event) {
  // Scroll the view by adjusting targetScrollOffset based on the wheel event delta
  targetScrollOffset += event.delta;

  // Constrain targetScrollOffset to prevent scrolling beyond the content
  targetScrollOffset = constrain(targetScrollOffset, 0, maxScrollOffset);
}

/*

                    TYPEWRITER OBJECT

*/

// Function to create a Typewriter object and compute text height
function createTypewriter(text, x, y, style) {
  // It convieniently unpacks the style properties for you
  let tw = new Typewriter(text, x, y, style.size, style.color, style.speed);
  tw.calculateTextHeight(); // Will create a textHeight property for the Typewriter
  return tw;
}

// Typewriter Class
class Typewriter {
  constructor(text, x, y, size, color, speed) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speed = speed; // typing speed (in milliseconds)
    
    this.index = 0; // current character index
    this.timer = 0; // timer to control typing speed
    this.typingFinished = false; // flag to check if typing is done
  }
  
  update() {
    // If typing is not finished...
    if (!this.typingFinished) {
      this.timer += deltaTime; // ...increase timer by the time since last frame
      if (this.timer > this.speed) {
        this.index++; // increase index to show more characters
        this.timer = 0; // reset the timer
      }
      
      // Stop typing when the whole text is shown
      if (this.index >= this.text.length) {
        this.typingFinished = true; 
      }
    }
  }
  
  // Method to calculate the height of the wrapped text
  calculateTextHeight() {
    textSize(this.size);
    textLeading(this.size * 1.2); // Note: textLeading() is the sum of textSize AND the space following each line.
    
    let textLines = textAsLines(this.text, this.size, boxWidth); // List of individual wrapped lines
    // Multiply the total height of each line by the number of lines
    this.textHeight = textLines.length * textLeading();
  }
  
  // Display the current substring
  display() {
    // fill(30);
    // rect(this.x, this.y, boxWidth, this.textHeight);
    
    // Using all the apropriate styling
    fill(this.color);
    textSize(this.size);
    text(this.text.substring(0, this.index), this.x, this.y, boxWidth);
  }
}

// Function to split text into lines by wrapping it to the maximum width
function textAsLines(text, size, maxWidth) {
  textSize(size);
  
  let words = text.split(' '); // List of individual words
  let lines = [];
  let currentLine = '';

  for (let word of words) {
    let testLine = currentLine + word + ' ';
    let testWidth = textWidth(testLine);
    
    // If the test line is too wide...
    if (testWidth > maxWidth && currentLine.length > 0) {
      // Just add the line WITHOUT the last word
      lines.push(currentLine);
      currentLine = word + ' '; // then start a new line with that word
    } else {
      // The test line fits
      currentLine = testLine;
    }
  }
  
  // We've gone through all the words. Add the final line.
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  
  return lines;
}
