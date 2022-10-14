const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");

const settings = {
  dimensions: [1080, 1080],
};

/**
 *
 * @returns {function({ context: CanvasRenderingContext2D, width: number, height: number})}
 */
const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
  };
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
