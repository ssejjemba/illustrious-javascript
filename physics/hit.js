// This will determine intersection of a canvas drawing and the cursor

/**
 *
 * @param {Point} point
 * @param {{ radius: number, center: Point }} circle
 * @returns {boolean}
 */
export function isHitCircle(point, circle) {
  const distanceFromCenter = getDistance(point, circle.center);

  const offset = 5;

  return distanceFromCenter < circle.radius + offset;
}

/**
 * @typedef {{ x: number, y: number}} Point
 * @param {Point} pointA
 * @param {Point} pointB
 * @returns {number}
 */
export function getDistance(pointA, pointB) {
  const dx = pointA.x - pointB.x;
  const dy = pointB.y - pointB.y;

  return Math.sqrt(dx * dx + dy * dy);
}
