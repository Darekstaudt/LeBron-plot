// LeBron Plot Game
const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const size = 500;
const axisMin = -10;
const axisMax = 10;
const gridStep = 25; // 1 unit = 25px
const origin = { x: size/2, y: size/2 };
let dragging = false;
let point = { x: 0, y: 0 };
let target = randomPoint();

function drawGraph() {
  ctx.clearRect(0, 0, size, size);
  // Draw grid lines
  ctx.strokeStyle = '#bbb';
  ctx.lineWidth = 1;
  for (let i = axisMin; i <= axisMax; i++) {
    // Vertical grid
    ctx.beginPath();
    ctx.moveTo(origin.x + i*gridStep, 0);
    ctx.lineTo(origin.x + i*gridStep, size);
    ctx.stroke();
    // Horizontal grid
    ctx.beginPath();
    ctx.moveTo(0, origin.y - i*gridStep);
    ctx.lineTo(size, origin.y - i*gridStep);
    ctx.stroke();
  }
  // Draw axes
  ctx.strokeStyle = '#552583';
  ctx.lineWidth = 2;
  // x axis
  ctx.beginPath();
  ctx.moveTo(0, origin.y);
  ctx.lineTo(size, origin.y);
  ctx.stroke();
  // y axis
  ctx.beginPath();
  ctx.moveTo(origin.x, 0);
  ctx.lineTo(origin.x, size);
  ctx.stroke();
  // Draw axis labels
  ctx.fillStyle = '#552583';
  ctx.font = '14px Arial';
  for (let i = axisMin; i <= axisMax; i++) {
    // x labels
    ctx.fillText(i, origin.x + i*gridStep - 7, origin.y + 18);
    // y labels
    if (i !== 0) ctx.fillText(i, origin.x + 8, origin.y - i*gridStep + 5);
  }
  // Draw draggable point
  drawPoint(point.x, point.y, '#FDB927');
}

function drawPoint(x, y, color) {
  const px = origin.x + x*gridStep;
  const py = origin.y - y*gridStep;
  ctx.beginPath();
  ctx.arc(px, py, 10, 0, 2*Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = '#552583';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function randomPoint() {
  let x = Math.floor(Math.random()*21) - 10;
  let y = Math.floor(Math.random()*21) - 10;
  return { x, y };
}

function updateProblem() {
  document.getElementById('target-point').textContent = `(${target.x}, ${target.y})`;
}

canvas.addEventListener('mousedown', function(e) {
  const mouse = getMousePos(e);
  if (isOnPoint(mouse.x, mouse.y)) {
    dragging = true;
  }
});
canvas.addEventListener('mousemove', function(e) {
  if (dragging) {
    const mouse = getMousePos(e);
    // Snap to nearest integer grid
    let x = Math.round((mouse.x - origin.x)/gridStep);
    let y = Math.round((origin.y - mouse.y)/gridStep);
    x = Math.max(axisMin, Math.min(axisMax, x));
    y = Math.max(axisMin, Math.min(axisMax, y));
    point.x = x;
    point.y = y;
    drawGraph();
  }
});
canvas.addEventListener('mouseup', function(e) {
  dragging = false;
});
canvas.addEventListener('mouseleave', function(e) {
  dragging = false;
});

function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}
function isOnPoint(mx, my) {
  const px = origin.x + point.x*gridStep;
  const py = origin.y - point.y*gridStep;
  return Math.hypot(mx-px, my-py) < 15;
}

document.getElementById('check-btn').addEventListener('click', function() {
  const result = document.getElementById('result');
  if (point.x === target.x && point.y === target.y) {
    result.textContent = 'Correct! LeBron would be proud!';
    result.style.color = '#FDB927';
    setTimeout(() => {
      target = randomPoint();
      point = { x: 0, y: 0 };
      updateProblem();
      drawGraph();
      result.textContent = '';
      result.style.color = '#552583';
    }, 1500);
  } else {
    result.textContent = 'Incorrect. Try again!';
    result.style.color = '#552583';
  }
});

updateProblem();
drawGraph();
