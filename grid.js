const canvasSketch = require("canvas-sketch");
const { Circle } = require("./shapes/circle");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const colormap = require("colormap");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const points = [];
const cols = 72;
const rows = 8;

/**
 * @param { canvas: HTMLCanvasElement }
 * @returns {function({ context: CanvasRenderingContext2D, width: number, height: number})}
 */
const sketch = ({ canvas, width, height }) => {
  const numCells = cols * rows;

  // grid dimensions
  const gw = 0.8 * width;
  const gh = 0.8 * height;

  // cell dimensions
  const cw = gw / cols;
  const ch = gh / rows;

  // margins
  const mx = (width - gw) * 0.5;
  const my = (height - gh) * 0.5;

  let x, y, n, lineWidth, color;
  let frequency = 0.002;
  let amplitude = 90;

  let colors = colormap({
    colormap: "inferno",
    nshades: amplitude,
    format: "hex",
    alpha: 1,
  });

  for (let i = 0; i < numCells; i++) {
    x = (i % cols) * cw;
    y = Math.floor(i / cols) * ch;

    n = random.noise2D(x, y, frequency, amplitude);
    x += n;
    y += n;

    lineWidth = math.mapRange(n, -amplitude, amplitude, 0, 5);

    color =
      colors[Math.floor(math.mapRange(n, -amplitude, amplitude, 0, amplitude))];

    points.push(
      new Circle({ x, y, radius: 5, control: true, lineWidth, color })
    );
  }

  return ({ context, width, height, frame }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    context.save();

    context.translate(mx, my);
    context.translate(cw * 0.5, ch * 0.5);

    points.forEach((point) => {
      n = random.noise2D(point.ix + frame * 3, point.iy, frequency, amplitude);
      point.x = point.ix + n;
      point.y = point.iy + n;
    });
    connectLinesToPoints(context);

    context.restore();
  };
};

/**
 *
 * @param {CanvasRenderingContext2D} context
 */
const connectLinesToPoints = (context) => {
  context.save();

  context.strokeStyle = "red";
  context.lineWidth = 4;

  for (let r = 0; r < rows; r++) {
    let lastX, lastY;
    for (let c = 0; c < cols - 1; c++) {
      const curr = points[r * cols + c];
      const next = points[r * cols + c + 1];

      const mx = curr.x + (next.x - curr.x) * 0.8;
      const my = curr.y + (next.y - curr.y) * 5.5;

      if (c === 0) {
        lastX = curr.x;
        lastY = curr.y;
      }

      context.beginPath();
      context.lineWidth = curr.lineWidth;
      context.strokeStyle = curr.color;
      context.moveTo(lastX, lastY);
      context.quadraticCurveTo(curr.x, curr.y, mx, my);
      context.stroke();

      lastX = mx - (c / cols) * 250;
      lastY = my - (r / rows) * 250;
    }
  }

  context.restore();
};

canvasSketch(sketch, settings);
