const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const size = 400;
const dpr = window.devicePixelRatio;
canvas.width = size * dpr;
canvas.height = size * dpr;
context.scale(dpr, dpr);

const step = 30;
const centerX = size / 2;

// Función para dibujar una línea curva vertical irregular
function drawWavyLine() {
  const line = [];

  for (let j = step; j <= size - step; j += step) {
    const random = (Math.random() - 0.5) * 200;
    const point = { x: centerX + random, y: j };
    line.push(point);
  }

  context.beginPath();
  context.moveTo(line[0].x, line[0].y);

  for (let i = 1; i < line.length - 1; i++) {
    const current = line[i];
    const next = line[i + 1];
    const midPoint = {
      x: (current.x + next.x) / 2,
      y: (current.y + next.y) / 2
    };
    context.quadraticCurveTo(current.x, current.y, midPoint.x, midPoint.y);
  }

  const last = line[line.length - 1];
  context.lineTo(last.x, last.y);
  context.stroke();
}

// Dibujar múltiples líneas superpuestas
context.strokeStyle = 'black';

const totalLines = 20;

for (let i = 0; i < totalLines; i++) {
  context.lineWidth = Math.floor(0.5 + Math.random() * 5);
  drawWavyLine();
}
