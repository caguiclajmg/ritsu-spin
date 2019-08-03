const img = document.getElementById('img');

const images = [];

for(let i = 1; i <= 24; ++i) {
    images[i] = new Image();
    images[i].src = `static/images/${i}.png`;
}

let currentFrame = 1;
let velocity = 0.0;

function updat(e) {
    velocity += -velocity * 0.05;
    if(Math.abs(velocity) < 0.001) velocity = 0.0;

    currentFrame += velocity > 0 ? Math.floor(velocity) : Math.ceil(velocity);
    if(currentFrame >= images.length) currentFrame = 1;
    if(currentFrame < 1) currentFrame = images.length - 1;

    img.src = images[currentFrame].src;
    console.log(`Frame: ${currentFrame} Velocity: ${velocity}`);
}

setInterval(updat, 50);

let swiping = false;
let swipingStartPosition = null;
let swipingStartTime = null;
let swipingEndPosition = null;
let swipingEndTime = null;

function actionDown(e) {
    swiping = true;
    swipingStartPosition = {x: e.clientX, y: e.clientY};
    swipingStartTime = Date.now();
}

function actionUp(e) {
    swiping = false;
    swipingEndPosition = {x: e.clientX, y: e.clientY};
    swipingEndTime = Date.now();

    let deltaTime = swipingEndTime - swipingStartTime;
    let deltaPosition = {x: swipingEndPosition.x - swipingStartPosition.x, y: swipingEndPosition.y - swipingStartPosition.y};

    let additionalVelocity = 12.0 * (deltaPosition.x > 0 ? -1.0 : 1.0);
    additionalVelocity *= Math.abs(deltaPosition.x) / e.srcElement.offsetWidth; // scale using distance
    additionalVelocity *= deltaTime / 50.0; // scale using time
    console.log(deltaTime);
    velocity += additionalVelocity;    
}

img.addEventListener('mousedown', actionDown);
img.addEventListener('mouseup', actionUp);
img.addEventListener('touchstart', actionDown);
img.addEventListener('touchend', actionUp);