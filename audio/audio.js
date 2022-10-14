const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const eases = require("eases");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

/**
 * @type {HTMLAudioElement}
 */
let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager;
let _width, _height;
let minDb, maxDb;

const numCircles = 5;
const numSlices = 9;
const slice = (Math.PI * 2) / numSlices;
const radius = 200;

const bins = [];
const lineWidths = [];

let lineWidth, bin, mapped;

/**
 * @param { canvas: HTMLCanvasElement }
 * @returns {function({ context: CanvasRenderingContext2D, width: number, height: number})}
 */
const sketch = () => {
  for (let i = 0; i < numCircles * numSlices; i++) {
    bin = random.rangeFloor(4, 64);
    if (random.value() > 0.5) bin = 0;
    bins.push(bin);
  }

  for (let i = 0; i < numCircles; i++) {
    const t = i / (numCircles - 1);
    lineWidth = eases.quadIn(t) * 200 + 20;
    lineWidths.push(lineWidth);
  }
  // audio.play();
  return ({ context, width, height }) => {
    context.fillStyle = "#EEEAE0";
    context.fillRect(0, 0, width, height);
    _width = width;
    _height = height;
    createVisualisation(context);
  };
};

/**
 *
 * @param {CanvasRenderingContext2D} context
 */
const createVisualisation = (context) => {
  if (!audioContext) return;

  analyserNode.getFloatFrequencyData(audioData);

  context.save();
  context.translate(_width * 0.5, _height * 0.5);

  let cradius = radius;

  for (let i = 0; i < numCircles; i++) {
    context.save();

    for (let j = 0; j < numSlices; j++) {
      context.rotate(slice);
      context.lineWidth = lineWidths[i];

      bin = bins[i * numSlices + j];
      if (!bin) continue;

      mapped = math.mapRange(audioData[bin], minDb, maxDb, 0, 1, true);

      lineWidth = lineWidths[i] * mapped;
      if (lineWidth < 1) continue;

      context.lineWidth = lineWidth;

      context.beginPath();
      context.arc(0, 0, cradius + context.lineWidth * 0.5, 0, slice);
      context.stroke();
    }

    cradius += lineWidths[i];

    context.restore();
  }

  context.restore();
};

const addListeners = () => {
  window.addEventListener("mouseup", () => {
    if (!audioContext) {
      createAudio();
    }
    if (audio.paused) {
      audio.play();
      manager.play();
    } else {
      audio.pause();
      manager.pause();
    }
  });
};

const createAudio = () => {
  audio = document.createElement("audio");
  audio.src = "./assets/WEARETHEGOOD - Live in the Moment.mp3";

  audioContext = new AudioContext();
  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.smoothingTimeConstant = 0.9;
  sourceNode.connect(analyserNode);
  minDb = analyserNode.minDecibels;
  maxDb = analyserNode.maxDecibels;

  audioData = new Float32Array(analyserNode.frequencyBinCount);
};

const getAverage = (data) => {
  const sum = data.reduce((prev, curr) => prev + curr, 0);
  return sum / data.length;
};

const start = async () => {
  addListeners();
  manager = await canvasSketch(sketch, settings);

  manager.pause();
};

start();
