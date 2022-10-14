const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const { DragRecognizer } = require("./events");
const { isHitCircle } = require("./physics/hit");
const { Circle } = require("./shapes/circle");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const dotsRadius = 10;

const points = [
  new Circle({ x: 200, y: 540, radius: dotsRadius }),
  new Circle({ x: 400, y: 300, radius: dotsRadius }),
  new Circle({ x: 880, y: 540, radius: dotsRadius }),
  new Circle({ x: 600, y: 700, radius: dotsRadius }),
  new Circle({ x: 640, y: 900, radius: dotsRadius }),
];
/**
 * @param { canvas: HTMLCanvasElement }
 * @returns {function({ context: CanvasRenderingContext2D, width: number, height: number})}
 */
const sketch = ({ canvas }) => {
  const dragRecogniser = new DragRecognizer(canvas, { onDrag, onDragStart });
  dragRecogniser.attachListener();
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.strokeStyle = "#999";
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }
    context.stroke();

    drawSeemlessCurve(context);

    points.forEach((point) => point.draw(context));
  };
};

const onDragStart = (place) => {
  let hit = false;
  points.forEach((point) => {
    point.isDragging = isHitCircle(place, {
      radius: dotsRadius,
      center: point,
    });
    if (!hit && point.isDragging) {
      hit = true;
    }
  });

  if (!hit) {
    addPointToPlace(place);
  }
};

const addPointToPlace = (place) => {
  points.push(new Circle({ x: place.x, y: place.y, radius: dotsRadius }));
};

/**
 *
 * @param {{ x: number, y: number}}
 */
const onDrag = ({ x, y }) => {
  points.forEach((point) => {
    if (point.isDragging) {
      point.x = x;
      point.y = y;
    }
  });
};

/**
 *
 * @param {CanvasRenderingContext2D} context
 */
const drawSeemlessCurve = (context) => {
  context.save();
  context.beginPath();
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];

    const mx = curr.x + (next.x - curr.x) * 0.5;
    const my = curr.y + (next.y - curr.y) * 0.5;
    if (i === 0) {
      context.moveTo(curr.x, curr.y);
    }
    if (i === points.length - 2) {
      context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
      continue;
    }
    context.quadraticCurveTo(curr.x, curr.y, mx, my);
  }
  context.lineWidth = 4;
  context.strokeStyle = "blue";
  context.stroke();
  context.restore();
};

/**
 * @description This draws a rectangle that is skewed by particular degrees
 * @param {CanvasRenderingContext2D} context
 * @param {number} width
 * @param {number} height
 * @param {number} degrees
 */
const drawSkewedRect = (context, width = 200, height = 200, degrees = -45) => {
  const angle = math.degToRad(degrees);
  const rx = width * Math.cos(angle);
  const ry = height * Math.sin(angle);

  context.save();
  context.translate(rx * -0.5, (ry + height) * -0.5);

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + height);
  context.lineTo(0, height);
  context.closePath();
  context.stroke();

  context.restore();
};

canvasSketch(sketch, settings);
