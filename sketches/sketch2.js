// Moving Circles

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const size = 400;
const cols = 10;
const rows = 10;
const cellSize = size / cols;
canvas.width = size;
canvas.height = size;

const corners = [
  [0, 0], // top-left
  [cellSize, 0], // top-right
  [0, cellSize], // bottom-left
  [cellSize, cellSize] // bottom-right
];

const circlesPerCell = 10;
const maxRadius = Math.sqrt(cellSize * cellSize * 2);
const globalSpeed = 20; // radius units per second

const grid = [];

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const x = col * cellSize;
    const y = row * cellSize;
    grid.push({
      x,
      y,
      corner: corners[Math.floor(Math.random() * corners.length)],
      offset: 0,
      speed: globalSpeed,
      lastChange: 0,
      changeInterval: 2000 + Math.random() * 3000
    });
  }
}

let lastTime = 0;

function draw(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  context.clearRect(0, 0, size, size);

  for (const cell of grid) {
    const { x, y, speed } = cell;

    // Cambiar esquina de origen con el tiempo
    if (timestamp - cell.lastChange > cell.changeInterval) {
      cell.corner = corners[Math.floor(Math.random() * corners.length)];
      cell.lastChange = timestamp;
      cell.offset = 0;
    }

    cell.offset += speed * deltaTime;
    if (cell.offset > maxRadius) {
      cell.offset -= maxRadius;
    }

    context.save();
    context.beginPath();
    context.rect(x, y, cellSize, cellSize);
    context.clip();

    context.translate(x, y);

    const spacing = maxRadius / circlesPerCell;
    const cx = cell.corner[0];
    const cy = cell.corner[1];

    context.strokeStyle = "#000";
    context.lineWidth = 2;

    const totalCircles = Math.ceil(maxRadius / spacing) + 2;

    for (let i = -totalCircles; i < totalCircles; i++) {
      const radius = i * spacing + cell.offset;
      if (radius <= 0) continue;

      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2);
      context.stroke();
    }

    context.restore();
  }

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
