const SIZE = 600;
const STEPS = 10;

function setup() {
  createCanvas(SIZE, SIZE);
}

function draw() {
  for (let x = 0; x < width; x += STEPS) {
    let y = noise(x * 0.01, frameCount * 0.01) * height;
    ellipse(x, y, 5, 5);
  }
}