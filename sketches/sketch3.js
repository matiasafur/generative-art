// Moving Circles - rotative center

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const size = 600;
const cols = 8;
const rows = 8;
const cellSize = size / cols;
const halfCellSize = cellSize / 2;
canvas.width = size;
canvas.height = size;

const corners = [
  [0, 0], // top-left
  [cellSize, 0], // top-right
  [0, cellSize], // bottom-left
  [cellSize, cellSize], // bottom-right
  [cellSize, halfCellSize], // right-center
  [halfCellSize, cellSize] // bottom-center
];

const circlesPerCell = 5;
const maxRadius = Math.sqrt(2 * cellSize * cellSize); // diagonal
const grid = [];

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const x = col * cellSize;
    const y = row * cellSize;
    grid.push({
      x,
      y,
      corner: corners[Math.floor(Math.random() * corners.length)],
      offset: Math.random() * maxRadius,
      speed: (1 + Math.random() * 20) * (Math.random() < 0.5 ? 1 : -1), // aleatorio y puede ser negativo
      lastChange: 0,
      changeInterval: 3000 + Math.random() * 2000,
      direction: Math.random() < 0.5 ? 1 : -1, // giro horario o antihorario
      expandDirection: Math.random() < 0.5 ? 1 : -1 // expansión o contracción
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

    // Mover centro a lo largo del borde
    const baseT = timestamp / 5000 + cell.x * 0.01 + cell.y * 0.01;
    const t = (((cell.direction * baseT) % 1) + 1) % 1; // aseguro que esté entre 0 y 1

    const cx = (() => {
      if (t < 0.25) return x + t * 4 * cellSize; // top
      if (t < 0.5) return x + cellSize; // right
      if (t < 0.75) return x + (1 - (t - 0.5) * 4) * cellSize; // bottom
      return x; // left
    })();
    const cy = (() => {
      if (t < 0.25) return y; // top
      if (t < 0.5) return y + (t - 0.25) * 4 * cellSize; // right
      if (t < 0.75) return y + cellSize; // bottom
      return y + (1 - (t - 0.75) * 4) * cellSize; // left
    })();

    // Cambiar esquina cada X tiempo
    if (timestamp - cell.lastChange > cell.changeInterval) {
      cell.corner = corners[Math.floor(Math.random() * corners.length)];
      cell.lastChange = timestamp;
      cell.offset = 0;
      cell.speed = (10 + Math.random() * 40) * (Math.random() < 0.5 ? 1 : -1);
    }

    cell.offset += cell.speed * deltaTime;
    if (cell.offset > maxRadius) cell.offset -= maxRadius;
    if (cell.offset < 0) cell.offset += maxRadius;

    context.save();
    context.beginPath();
    context.rect(x, y, cellSize, cellSize);
    context.clip();
    context.translate(x, y);

    const spacing = maxRadius / circlesPerCell;
    const totalCircles = Math.ceil(maxRadius / spacing) + 2;

    context.strokeStyle = "#000";
    context.lineWidth = 2;

    for (let i = -totalCircles; i < totalCircles; i++) {
      const baseRadius = i * spacing;
      const radius =
        cell.expandDirection > 0
          ? baseRadius + cell.offset
          : baseRadius + (spacing - cell.offset);

      if (radius <= 0 || radius > maxRadius) continue;

      context.beginPath();
      context.arc(cx - x, cy - y, radius, 0, Math.PI * 2);
      context.stroke();
    }

    context.restore();
  }

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
