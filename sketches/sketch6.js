const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const margin = 60
const size = 600;
canvas.width = size;
canvas.height = size;

const steps = 120;
const minW = 4;
const maxW = 16;
const wStep = 0.5;
const trend = 0.05;
const jitter = 0.3;
const branchChance = 0.08; // probabilidad de generar rama en cada punto
const maxBranchDepth = 4;
const branchLengthFactor = 0.6; // longitud relativa de cada rama
const branchAngleSpread = Math.PI / 3; // rango de bifurcación

let spinePoints = []; // guardaremos puntos y ángulos de la espina

function drawSpineAndCollect() {
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = '#A0E7E5';

  let w = (minW + maxW) / 2;
  let prev = {
    x: margin + Math.random() * (size - 2 * margin),
    y: margin
  };
  const end = {
    x: margin + Math.random() * (size - 2 * margin),
    y: size - margin
  };
  const baseAngle = Math.atan2(end.y - prev.y, end.x - prev.x);
  const dx = end.x - prev.x, dy = end.y - prev.y;
  const stepLen = Math.hypot(dx, dy) / steps;

  spinePoints = [];
  let angle = baseAngle;

  for (let i = 1; i <= steps; i++) {
    // variación de ángulo
    angle += (baseAngle - angle) * trend + (Math.random() * 2 - 1) * jitter;
    // siguiente punto
    const next = {
      x: prev.x + Math.cos(angle) * stepLen,
      y: prev.y + Math.sin(angle) * stepLen
    };
    // ancho
    w += (Math.random() * 2 - 1) * wStep;
    w = Math.max(minW, Math.min(maxW, w));

    // dibujar segmento de espina
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();

    // guardar para ramas
    spinePoints.push({ x: next.x, y: next.y, angle });

    prev = next;
  }
}

function drawBranch(x, y, angle, depth, length) {
  if (depth === 0) return;

  // variación ligera de longitud y dirección
  const len = length * (0.7 + Math.random() * 0.3);
  angle += (Math.random() * 2 - 1) * (Math.PI / 8);

  const nx = x + Math.cos(angle) * len;
  const ny = y + Math.sin(angle) * len;

  // ancho decrece con la profundidad
  ctx.lineWidth = Math.max(1, depth);
  ctx.strokeStyle = '#B4F8C8';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(nx, ny);
  ctx.stroke();

  // bifurcación: dos ramas laterales
  if (Math.random() < 0.7) {
    drawBranch(nx, ny, angle + branchAngleSpread * (Math.random() - 0.5), depth - 1, len * branchLengthFactor);
  }
  if (Math.random() < 0.7) {
    drawBranch(nx, ny, angle - branchAngleSpread * (Math.random() - 0.5), depth - 1, len * branchLengthFactor);
  }
}

function draw() {
  drawSpineAndCollect();
  // generar ramas en algunos puntos de la espina
  for (let pt of spinePoints) {
    if (Math.random() < branchChance) {
      drawBranch(pt.x, pt.y, pt.angle + (Math.random() - 0.5) * (Math.PI / 6),
        maxBranchDepth, (size / steps) * branchLengthFactor);
    }
  }
}

draw();
