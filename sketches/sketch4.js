var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");

const size = 600;
const cols = 20;
const rows = 20;
const cellSize = size / cols;
canvas.width = size;
canvas.height = size;

const directions = [
  0, // horizontal
  Math.PI / 2, // vertical
  Math.PI / 4, // 45°
  -Math.PI / 4 // -45°
];

const startLinesPerCell = 8;
const hoverLinesPerCell = 12;
const lineColor = "#000";
const globalSpeed = 2; // píxeles por segundo

let linesPerCell = startLinesPerCell;

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

// Posición del mouse (inicial fuera del canvas)
let mouseX = -1;
let mouseY = -1;

// Detectar posición del mouse relativa al canvas
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

canvas.addEventListener("mouseleave", () => {
  mouseX = -1;
  mouseY = -1;
});

function draw(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const deltaTime = (timestamp - lastTime) / 1000; // en segundos
  lastTime = timestamp;

  context.clearRect(0, 0, size, size);

  for (const cell of grid) {
    const { x, y, speed } = cell;

    // Cambio de dirección con el tiempo
    if (timestamp - cell.lastChange > cell.changeInterval) {
      cell.angle = directions[Math.floor(Math.random() * directions.length)];
      cell.lastChange = timestamp;
      cell.offset = 0;
    }

    cell.offset += speed * deltaTime;
    if (cell.offset > cellSize) cell.offset -= cellSize;

    // Verifico si el mouse está sobre esta celda
    const mouseOver =
      mouseX >= x && mouseX < x + cellSize &&
      mouseY >= y && mouseY < y + cellSize;

    cell.angle = mouseOver ? directions[0] : cell.angle;
    linesPerCell = mouseOver ? hoverLinesPerCell : startLinesPerCell;

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
