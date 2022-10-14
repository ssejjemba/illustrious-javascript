export class DragRecognizer {
  isDragging = false;
  lastKnownPosition = { x: 0, y: 0 };
  /**
   *
   * @param {HTMLCanvasElement | Window} target
   * @param {{ onDragStart?: dragEdgeCallback, onDrag: dragCallback, onDragEnd?: dragEdgeCallback}} callHandler
   */
  constructor(target, callHandler) {
    this.target = target;
    this.callHandler = callHandler;
  }

  attachListener = () => {
    this.target.addEventListener("mousedown", this.mousedown);
  };

  removeListener = () => {
    this.target.removeEventListener("mousedown", this.mousedown);
    this.target.removeEventListener("mousemove", this.mousemove);
    this.target.removeEventListener("mouseup", this.mouseup);
  };

  /**
   *
   * @param {Event | MouseEvent} e
   */
  mousedown = (e) => {
    this.isDragging = true;
    this.target.addEventListener("mousemove", this.mousemove);
    this.target.addEventListener("mouseup", this.mouseup);
    const x = (e.offsetX / this.target.offsetWidth) * this.target.offsetWidth;
    const y = (e.offsetY / this.target.offsetHeight) * this.target.offsetHeight;
    this.lastKnownPosition = { x, y };
    if (this.callHandler.onDragStart) {
      this.callHandler.onDragStart({ e });
    }
  };

  /**
   *
   * @param {Event | MouseEvent} e
   * @returns {boolean}
   */
  mousemove = (e) => {
    if (!this.isDragging) {
      return false;
    }

    const x = (e.offsetX / this.target.offsetWidth) * this.target.offsetWidth;
    const y = (e.offsetY / this.target.offsetHeight) * this.target.offsetHeight;

    const dx = x - this.lastKnownPosition.x;
    const dy = y - this.lastKnownPosition.y;

    this.callHandler.onDrag({ x, y, dx, dy, e });

    this.lastKnownPosition = { x, y };
  };

  /**
   *
   * @param {Event | MouseEvent} e
   */
  mouseup = (e) => {
    this.isDragging = false;
    this.target.removeEventListener("mousemove", this.mousemove);
    this.target.removeEventListener("mouseup", this.mouseup);
    if (this.callHandler.onDragEnd) {
      this.callHandler.onDragEnd({ e });
    }
    this.lastKnownPosition = { x: 0, y: 0 };
  };
}

/**
 * @callback dragCallback
 * @param {{ x: number, y: number, dx: number, dy: number, e: MouseEvent}}
 */

/**
 * @callback dragEdgeCallback
 * @param {{  e: MouseEvent}}
 */
