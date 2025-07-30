// Moving Lines

var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");

const size = 400;
const cols = 10;
const rows = 10;
const cellSize = size / cols;
canvas.width = size;
canvas.height = size;

const directions = [
  0, // horizontal
  Math.PI / 2, // vertical
  Math.PI / 4, // 45°
  -Math.PI / 4 // -45°
];

const linesPerCell = 8;
const lineColor = "#000";
const globalSpeed = 2; // píxeles por segundo

const grid = [];

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    grid.push({
      x: col * cellSize,
      y: row * cellSize,
      angle: directions[Math.floor(Math.random() * directions.length)],
      offset: Math.random() * cellSize,
      speed: globalSpeed * (0.5 + Math.random() * 1.5),
      lastChange: 0,
      changeInterval: 2000 + Math.random() * 2000 // entre 2 y 4 segundos
    });
  }
}

let lastTime = 0;

function draw(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000; // en segundos
  lastTime = timestamp;

  context.clearRect(0, 0, size, size);

  for (const cell of grid) {
    const { x, y, speed } = cell;

    // Cambio de dirección con el tiempo
    if (timestamp - cell.lastChange > cell.changeInterval) {
      const newAngle =
        directions[Math.floor(Math.random() * directions.length)];
      cell.angle = newAngle;
      cell.lastChange = timestamp;
      cell.offset = 0;
    }

    cell.offset += speed * deltaTime;
    if (cell.offset > cellSize) cell.offset -= cellSize;

    const lineSpacing = cellSize / linesPerCell;
    const overdraw = cellSize;

    context.save();
    context.beginPath();
    context.rect(x, y, cellSize, cellSize);
    context.clip();

    context.translate(x + cellSize / 2, y + cellSize / 2);
    context.rotate(cell.angle);

    context.strokeStyle = lineColor;
    context.lineWidth = 1;

    for (
      let i = -cellSize - overdraw + cell.offset;
      i <= cellSize + overdraw;
      i += lineSpacing
    ) {
      context.beginPath();
      context.moveTo(i, -cellSize);
      context.lineTo(i, cellSize);
      context.stroke();
    }

    context.restore();
  }

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
