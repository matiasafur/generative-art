const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const size = 500;
const mesh = 8;
const gap = size / mesh;
canvas.width = size + gap;
canvas.height = size + gap;
context.lineJoin = 'bevel';

let lines = [];
let time = 0;

// Inicializar puntos con posición original y offset animado
for (let y = gap / 2; y <= size + gap; y += gap) {
  const line = [];
  const odd = (Math.round(y / gap) % 2 === 1);
  for (let x = gap / 4; x <= size + gap; x += gap) {
    const posX = x + (odd ? gap / 2 : 0);

    const angle = Math.random() * Math.PI * 2;
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);

    line.push({
      baseX: posX,
      baseY: y,
      dirX,
      dirY,
      offsetX: (Math.random() * 2 - 1) * gap * 0.4,
      offsetY: (Math.random() * 2 - 1) * gap * 0.4,
      noiseFactor: Math.random() * 2 + 1,
      phase: Math.random() * Math.PI * 2
    });
  }
  lines.push(line);
}

// Dibuja un solo triángulo
function drawTriangle(a, b, c, t) {
  context.beginPath();
  context.moveTo(a.x, a.y);
  context.lineTo(b.x, b.y);
  context.lineTo(c.x, c.y);
  context.closePath();

  // Color dinámico en escala de grises
  const base = Math.floor(100 + 80 * Math.sin(t * 0.001 + a.noiseFactor));
  const gray = Math.max(0, Math.min(255, base));
  context.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;

  context.fill();
  context.strokeStyle = "#111";
  context.stroke();
}

// Animación frame a frame
function animate(t) {
  time = t;
  context.clearRect(0, 0, size, size);

  const currentLines = lines.map(line =>
    line.map(p => {
      const oscillation = Math.sin(time * 0.001 * p.noiseFactor + p.phase);
      return {
        x: p.baseX + p.offsetX * p.dirX * oscillation,
        y: p.baseY + p.offsetY * p.dirY * oscillation,
        noiseFactor: p.noiseFactor
      };
    })
  );

  for (let y = 0; y < currentLines.length - 1; y++) {
    const odd = y % 2 === 0;
    let dotLine = [];
    for (let i = 0; i < currentLines[y].length; i++) {
      dotLine.push(odd ? currentLines[y][i] : currentLines[y + 1][i]);
      dotLine.push(odd ? currentLines[y + 1][i] : currentLines[y][i]);
    }
    for (let i = 0; i < dotLine.length - 2; i++) {
      drawTriangle(dotLine[i], dotLine[i + 1], dotLine[i + 2], time);
    }
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);