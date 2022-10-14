/**
 * This is a dot centered at a particular point in space
 */
export class Circle {
  /**
   *
   * @param {{ x: number, y: number, radius: number, control?: boolean, lineWidth?: number, color?: string}}
   */
  constructor({ x, y, radius, control = false, lineWidth, color }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.lineWidth = lineWidth;
    this.color = color;

    this.control = control;
    this.ix = x;
    this.iy = y;
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
