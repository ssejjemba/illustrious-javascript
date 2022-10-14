/**
 * This is a dot centered at a particular point in space
 */
class Point {
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {boolean?} control
   */
  constructor(x, y, control = false) {
    this.x = x;
    this.y = y;
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
    context.arc(0, 0, 5, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
