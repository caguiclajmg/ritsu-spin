const img = document.getElementById('img');
const root = document.getElementById('root');

const images = [];

for(let i = 0; i < 24; ++i) {
    images[i] = new Image();
    images[i].src = `static/images/${i + 1}.png`;
}

let currentFrame = 0;
let velocity = 0.0;

function updat(e) {
    velocity += -velocity * 0.05;
    if(Math.abs(velocity) < 0.001) velocity = 0.0;
    
    currentFrame += velocity > 0 ? Math.floor(velocity) : Math.ceil(velocity);
    if(currentFrame >= images.length) currentFrame = 1;
    if(currentFrame < 1) currentFrame = images.length - 1;

    //console.log(`Frame: ${currentFrame} Velocity: ${velocity}`);
    img.src = images[currentFrame].src;
}

let swiping = false;
let swipingStartPosition = null;
let swipingStartTime = null;
let swipingEndPosition = null;
let swipingEndTime = null;

function actionDown(position) {
    swiping = true;
    swipingStartPosition = {x: position.x, y: position.y};
    swipingStartTime = Date.now();
}

function actionUp(position) {
    swiping = false;
    swipingEndPosition = {x: position.x, y: position.y};
    swipingEndTime = Date.now();

    let deltaTime = swipingEndTime - swipingStartTime;
    let deltaPosition = {x: swipingEndPosition.x - swipingStartPosition.x, y: swipingEndPosition.y - swipingStartPosition.y};
    
    let additionalVelocity = 12.0 * (deltaPosition.x > 0 ? -1.0 : 1.0);
    additionalVelocity *= Math.abs(deltaPosition.x) / img.offsetWidth; // scale using distance
    additionalVelocity *= deltaTime / 100.0; // scale using time
    velocity += additionalVelocity;
}

img.addEventListener('mousedown', function(e) { actionDown({x: e.clientX, y: e.clientY}); });
img.addEventListener('mouseup', function(e) { actionUp({x: e.clientX, y: e.clientY}); });
img.addEventListener('touchstart', function(e) { actionDown({x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY})});
img.addEventListener('touchend', function(e) { actionUp({x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY})});

setInterval(updat, 50);
