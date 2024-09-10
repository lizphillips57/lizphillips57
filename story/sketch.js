/* 

Typewriter v3
Liz Phillips
MAT 111WN

TO-DO: Make a custom wrapping function that can compute the bounding box of multi-line text.
Use it to figure out where to position the next character's lines, responsively with the window size.
This also needs to resize the canvas height so you can scroll down...

Or, you could skip all that by using manual \n line breaks... Not a great long-term solution but it works for this class I guess.

*/

let dialogueIndex = 0;
let typewriters = [];
let dialogues = [];
let vw, vh, padding;
let cStyle, jStyle;

function preload() {
  font = loadFont("/fonts/KodeMono-VariableFont_wght.ttf");
}

function windowResized(){
  // Keep the canvas the same width as the window
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textWrap(WORD);
  textFont(font);
  
  // 1% viewport, for adjusting text size, etc.
  vw = 0.01 * windowWidth;
  vh = 0.01 * windowHeight;
  padding = 10*vw;
  textAlign(LEFT, TOP);
  
  cStyle = { color: color(255, 150, 0), size: 4*vh, speed: 100 };
  jStyle = { color: color(100, 100, 255), size: 4*vh, speed: 80 };
  
  // Array of dialogue objects, each with associated text and style properties
  dialogues = [
    {
      text: "Character A: Hello there! Hello there! Hello there! Hello there! Hello there! Hello there! Hello there! Hello there! Hello there!",
      style: cStyle
    },
    {
      text: "Character B: Hi! How are you?",
      style: jStyle
    },
    {
      text: "Character A: I'm doing great, thanks for asking!",
      style: cStyle
    },
    {
      text: "Character B: That's good to hear. Let's continue our adventure.",
      style: jStyle
    }
  ];

  // Create the first Typewriter object with the first dialogue's text and style
  let firstDialogue = dialogues[dialogueIndex];
  typewriters.push(new Typewriter(firstDialogue.text, padding, padding, firstDialogue.style.size, firstDialogue.style.color, firstDialogue.style.speed));
}

function draw() {
  background(240);

  // Loop through and update/display all Typewriter objects
  for (let tw of typewriters) {
    tw.update();
    tw.display();
  }
}

function mousePressed() {
  let currentTypewriter = typewriters[typewriters.length - 1]; // Get the latest Typewriter object
  
  // If the current line is fully typed, advance to the next dialogue
  if (currentTypewriter.typingFinished) {
    if (dialogueIndex < dialogues.length - 1) {
      dialogueIndex++;
      
      // Retrieve the next dialogue and its style properties
      let nextDialogue = dialogues[dialogueIndex];
      
      // Compute y position for the next line of dialogue
      let yPosition = padding + dialogueIndex * 60;
      
      // Create a new Typewriter object with the next dialogue's text and style
      typewriters.push(new Typewriter(nextDialogue.text, padding, yPosition, nextDialogue.style.size, nextDialogue.style.color, nextDialogue.style.speed));
    }
  } else {
    // If the current line isn't fully typed, complete it instantly
    currentTypewriter.index = currentTypewriter.text.length;
    currentTypewriter.typingFinished = true;
  }
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
    if (!this.typingFinished) {
      this.timer += deltaTime; // increase timer by time since last frame
      if (this.timer > this.speed) {
        this.index++; // increase index to show more characters
        this.timer = 0; // reset the timer
      }
      
      if (this.index >= this.text.length) {
        this.typingFinished = true; // stop typing when the whole text is shown
      }
    }
  }
  
  display() {
    fill(this.color);
    textSize(this.size);
    text(this.text.substring(0, this.index), this.x, this.y, windowWidth - 2*padding); // display the current substring
  }
}
