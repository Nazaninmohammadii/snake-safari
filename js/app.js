const gameCanvas = document.querySelector('#gameCanvas');
const context = gameCanvas.getContext('2d');
const scoreNumber = document.querySelector('#scoreNumber');
const resetButton = document.querySelector('#resetButton');
const gameWidth = gameCanvas.width;
const gameHeight =  gameCanvas.height;
const canvasBackground = "#000";
const snakeColor = "#4a8b3f";
const snakeBorder = "#000";
const foodColor = "#9f241a";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];

window.addEventListener('keydown', changeDirection);
resetButton.addEventListener('click', resetGame);

gameStart();


function gameStart(){ 
    running = true;
    scoreNumber.textContent = score;
    //invoking the other functions
    createFood();
    drawFood();
    nextTick();
};
function nextTick(){
    if(running){
        setTimeout(()=>{
            //listing an order of steps
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 100); //this is the speed, the higher the number the slower it gets.
    } else {
        //if the game currently is not running that means the game is over!
        displayGameOver();
    }
};

function clearBoard(){
    context.fillStyle = canvasBackground;
    context.fillRect(0, 0, gameWidth, gameHeight);
};

function createFood(){
    function randomFood(min, max){
        const randomNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randomNum; 
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
};

function drawFood(){
    context.fillStyle = foodColor; 
    context.fillRect(foodX, foodY, unitSize, unitSize);
};

function moveSnake(){
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};
    
    snake.unshift(head);
    //if food is eaten
    if (snake[0].x == foodX && snake[0].y == foodY) {
        score += 1;
        scoreNumber.textContent = score;
        createFood();
    } else {
        //this will eleminate the tail anytime we move
        snake.pop();
    }     
}; 

function drawSnake(){
    context.fillStyle = snakeColor;
    context.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        context.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        context.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
        // context.clearRect(0, 0, unitSize, unitSize);
    })
};

function changeDirection(event){
    const keyPressed = event.keyCode;
    // console.log(keyPressed);
    const up = 38;
    const right = 39;
    const down = 40;
    const left = 37;
    
    const goingup = (yVelocity == -unitSize);
    const goingright = (xVelocity == unitSize);
    const goingdown = (yVelocity == unitSize);
    const goingleft = (xVelocity == -unitSize);

    if (keyPressed == up && !goingdown) {
        xVelocity = 0;
        yVelocity = -unitSize;
    } else if (keyPressed == right && !goingleft) {
        xVelocity = unitSize;
        yVelocity = 0;
    } else if (keyPressed == down && !goingup) {
        xVelocity = 0;
        yVelocity = unitSize;
    } else if (keyPressed == left && !goingright) {
        xVelocity = -unitSize;
        yVelocity = 0;
    }
};

function checkGameOver(){
     switch(true){
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }
    //if the snake collides with itself and stops the game if it does.
    for(const snakePart of snake.slice(1)) {
    if(snakePart.x == snake[0].x && snakePart.y == snake[0].y) {
        //the snake has collided itself so the game is no longer running
        running = false;
    }
    }   
};

function displayGameOver(){
    context.fillStyle = "purple";
    context.font = "80px Pixelify Sans";
    context.textAlign = "center";

    // Shadow color
    context.shadowColor = 'rgba(245, 243, 81, 0.7)';
    context.shadowBlur = 2; 
    context.shadowOffsetX = 4; 
    context.shadowOffsetY = 4;
    context.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;
};

function resetGame(){
    xVelocity = unitSize;
    yVelocity = 0;
    score = 0;
    snake = [
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ];
    gameStart();
};
