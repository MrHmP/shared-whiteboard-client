/* Canvas */
let canvas = document.getElementById('drawCanvas');
let ctx = canvas.getContext('2d');
let color = document.querySelector(':checked').getAttribute('data-color');

canvas.width = Math.min(document.documentElement.clientWidth, window.innerWidth || 300);
canvas.height = Math.min(document.documentElement.clientHeight, window.innerHeight || 300);

ctx.strokeStyle = color;
ctx.lineWidth = '3';
ctx.lineCap = ctx.lineJoin = 'round';

/* Mouse and touch events */

document.getElementById('colorSwatch').addEventListener('click', function () {
	color = document.querySelector(':checked').getAttribute('data-color');
}, false);

let isTouchSupported = 'ontouchstart' in window;
let isPointerSupported = navigator.pointerEnabled;
let isMSPointerSupported = navigator.msPointerEnabled;

let downEvent = isTouchSupported ? 'touchstart' : (isPointerSupported ? 'pointerdown' : (isMSPointerSupported ? 'MSPointerDown' : 'mousedown'));
let moveEvent = isTouchSupported ? 'touchmove' : (isPointerSupported ? 'pointermove' : (isMSPointerSupported ? 'MSPointerMove' : 'mousemove'));
let upEvent = isTouchSupported ? 'touchend' : (isPointerSupported ? 'pointerup' : (isMSPointerSupported ? 'MSPointerUp' : 'mouseup'));

canvas.addEventListener(downEvent, startDraw, false);
canvas.addEventListener(moveEvent, draw, false);
canvas.addEventListener(upEvent, endDraw, false);

/* Draw on canvas */

function drawOnCanvas(color, plots) {
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(plots[0].x, plots[0].y);

	for (let i = 1; i < plots.length; i++) {
		ctx.lineTo(plots[i].x, plots[i].y);
	}
	ctx.stroke();
}

let isActive = false;
let plots = [];

function draw(e) {
	e.preventDefault();
	if (!isActive) return;

	let x = isTouchSupported ? (e.targetTouches[0].pageX - canvas.offsetLeft) : (e.offsetX || e.layerX - canvas.offsetLeft);
	let y = isTouchSupported ? (e.targetTouches[0].pageY - canvas.offsetTop) : (e.offsetY || e.layerY - canvas.offsetTop);

	plots.push({ x: (x << 0), y: (y << 0) });

	drawOnCanvas(color, plots);
}

function startDraw(e) {
	e.preventDefault();
	isActive = true;
}

function endDraw(e) {
	e.preventDefault();
	isActive = false;

	const streamId = uuidv4();
	publish({
		id: streamId,
		color: color,
		plots: plots
	}, () => {
		setStreamAsDrawn(streamId);
	});

	plots = [];
}

function drawFromStream(message) {
	let currentBoard = JSON.parse(localStorage.getItem('board'));
	const processedStreamIds = (currentBoard.processedStreams || []).
		filter(s => s === message.id);
	if (processedStreamIds.length == 0) {
		if (!message || message.plots.length < 1) return;
		drawOnCanvas(message.color, message.plots);
		setStreamAsDrawn(message.id);
	}
}

function setStreamAsDrawn(streamId) {
	let currentBoard = JSON.parse(localStorage.getItem('board'));
	if (currentBoard.processedStreams) {
		currentBoard.processedStreams.push(streamId);
	} else {
		currentBoard.processedStreams = [streamId];
	}
	localStorage.setItem('board', JSON.stringify(currentBoard));
}