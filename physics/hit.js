// This will determine intersection of a canvas drawing and the cursor

/**
 *
 * @param {Point} point
 * @param {{ radius: number, center: Point }} circle
 */
export function isHitCircle(point, circle) {
  const distanceFromCenter = getDistance(point, circle.center);

  return distanceFromCenter < circle.radius;
}

/**
 * @typedef {{ x: number, y: number}} Point
 * @param {Point} pointA
 * @param {Point} pointB
 */
export function getDistance(pointA, pointB) {
  const dx = pointA.x - pointB.x;
  const dy = pointB.y - pointB.y;

  return Math.sqrt(dx * dx + dy * dy);
}
