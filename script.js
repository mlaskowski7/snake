const board = document.querySelector(".board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let highscore = 0;


//reading High score from device's local storage
if(localStorage.getItem("high-score")){
    highscore = localStorage.getItem("high-score");
}
highScoreElement.textContent = `High Score: ${highscore}`;


//creating random food position
const updateFoodPosition = () =>{
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

//game over handling
const handleGameOver = () =>{
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
} 

//change direction on key click
const changeDirection = event => {
    if(event.key === "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    } else if (event.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (event.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }else if (event.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(button => button.addEventListener('click',() =>changeDirection({key: button.dataset.key})));

//inititalizing game 
const initGame = () =>{
    if(gameOver){
        return handleGameOver();
    }
    let html = `<div class="food" style = "grid-area: ${foodY} / ${foodX}"></div>`;

    // eating food
    if (snakeX === foodX && snakeY === foodY) {
    updateFoodPosition();
        snakeBody.push([foodY,foodX]);
        score +=1;
        highscore = score >= highscore ? score : highscore;

        localStorage.setItem("high-score",highscore);
        scoreElement.textContent = `Score: ${score}`;
        highScoreElement.textContent = `High Score: ${highscore}`;
    }

    // update Snake Head Location
    snakeX += velocityX;
    snakeY += velocityY;

    for(let i = snakeBody.length - 1; i > 0; i--){
        snakeBody[i] = snakeBody[i-1];
    }


    snakeBody[0] = [snakeX,snakeY];

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }
    
    // filling the snake body
    for(let i = 0; i < snakeBody.length; i++){
        html += `<div class= "head" style = "grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
        
    }
    board.innerHTML = html;
}
updateFoodPosition();
setIntervalId = setInterval(initGame,100);
document.addEventListener("keyup",changeDirection);