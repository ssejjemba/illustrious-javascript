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
  new Circle({ x: 400, y: 300, radius: dotsRadius, control: true }),
  new Circle({ x: 880, y: 540, radius: dotsRadius }),
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

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    context.quadraticCurveTo(
      points[1].x,
      points[1].y,
      points[2].x,
      points[2].y
    );
    context.stroke();

    points.forEach((point) => point.draw(context));
  };
};

const onDragStart = (place) => {
  points.forEach((point) => {
    point.isDragging = isHitCircle(place, {
      radius: dotsRadius,
      center: point,
    });
  });
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
