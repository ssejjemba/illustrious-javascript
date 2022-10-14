/**
 * This is a dot centered at a particular point in space
 */
export class Circle {
  /**
   *
   * @param {{ x: number, y: number, radius: number, control?: boolean}}
   */
  constructor({ x, y, radius, control = false }) {
    this.x = x;
    this.y = y;
    this.radius = radius;

    this.control = control;
  }

  /**
   * @description This draws a visual dot of the point in space
   * @param {CanvasRenderingContext2D} context
   */
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.control ? "red" : "black";

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
