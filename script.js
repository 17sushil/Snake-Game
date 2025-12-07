const main = document.querySelector('.main');
const width = (main.clientWidth);
const height = (main.clientHeight);
const box = 50;

const column = Math.floor(width / box);
const rows = Math.floor(height / box);

//variable declaration.
let StartButton = document.querySelector(".StartButton");
let GameStartScreen = document.querySelector(".GameStartScreen");
let GameOverScreen = document.querySelector(".GameOverScreen");
let RestartButton = document.querySelector(".RestartButton");
let scoreDisplay = document.querySelector(".score");
let highScoreDisplay = document.querySelector(".highScore");
let timeDisplay = document.querySelector(".time");
let gameloop;
let head;
let timeInterval;
let score = 0;
let highScore = 0;
let time = `00-00`;


//for timer
function timeCalculator() {
    time = `00-00`;
    timeDisplay.textContent = `${time}`;

    let min;
    let sec;
    timeInterval = setInterval(() => {
        [min, sec] = time.split("-").map(Number);
        sec += 1;
        if (sec >= 59) {
            min += 1;
        }
        time = `${min}-${sec}`;
        timeDisplay.textContent = `${time}`;
    }, 1000)
};


//Initiate Game.
StartButton.addEventListener("click", () => {
    GameStartScreen.style.display = "none";

    timeCalculator();

    //game Logic
    gameloop = setInterval(() => {
        let head = null;

        if (direction === "up") {
            head = { x: snake[0].x - 1, y: snake[0].y };
            if (head.x < 0) {
                head.x = rows - 1;
            }
        }
        else if (direction === "down") {
            head = { x: snake[0].x + 1, y: snake[0].y };
            if (head.x >= rows) {
                head.x = 0;
            }
        }
        else if (direction === "right") {
            head = { x: snake[0].x, y: snake[0].y + 1 };
            if (head.y >= column) {
                head.y = 0;
            }
        }
        else if (direction === "left") {
            head = { x: snake[0].x, y: snake[0].y - 1 };
            if (head.y < 0) {
                head.y = column - 1;
            }
        }


        snake.forEach((segment, index) => {
            cell = boxArray[`${segment.x}-${segment.y}`]
            if (index === 0) {
                cell.classList.remove("head");
            }
            else {
                cell.classList.remove("fill");
            }
        })


        // Collision Testing 
        const isCollision = snake.some(segment =>
            head.x == segment.x && head.y == segment.y
        )
        if (isCollision) {
            clearInterval(gameloop);
            clearInterval(timeInterval);
            GameOverScreen.style.display = "flex";
            RestartButton.addEventListener("click", RestartGame);
            return;
        }


        //food consuming logic
        if (food.x == head.x && food.y == head.y) {

            boxArray[`${food.x}-${food.y}`].classList.remove("food");
            food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * column) };
            while (snake.some(segment =>
                food.x == segment.x && food.y == segment.y
            )) {
                food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * column) };
            }

            boxArray[`${food.x}-${food.y}`].classList.add("food");
            snake.unshift(head);
            score += 1;
            scoreDisplay.textContent = `${score}`;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore.toString());
                highScore = parseInt(localStorage.getItem("highScore"));
                highScoreDisplay.textContent = `${highScore}`;
            }
        }


        snake.unshift(head);
        snake.pop();

        render();
    }, 200)

});

//Restarting Game Logic
function RestartGame() {
    clearInterval(timeInterval);
    timeCalculator();
    clearInterval(gameloop)
    renderRemove();
    scoreDisplay.textContent = "0";
    score = 0;
    direction = "right";
    GameOverScreen.style.display = "none";
    snake = [{ x: 5, y: 5 }, { x: 5, y: 4 }];

    gameloop = setInterval(() => {

        head = null;
        if (direction === "up") {
            head = { x: snake[0].x - 1, y: snake[0].y };
            if (head.x < 0) {
                head.x = rows - 1;
            }
        }
        else if (direction === "down") {
            head = { x: snake[0].x + 1, y: snake[0].y };
            if (head.x >= rows) {
                head.x = 0;
            }
        }
        else if (direction === "right") {
            head = { x: snake[0].x, y: snake[0].y + 1 };
            if (head.y >= column) {
                head.y = 0;
            }
        }
        else if (direction === "left") {
            head = { x: snake[0].x, y: snake[0].y - 1 };
            if (head.y < 0) {
                head.y = column - 1;
            }
        }
        snake.forEach((segment, index) => {
            cell = boxArray[`${segment.x}-${segment.y}`]
            if (index === 0) {
                cell.classList.remove("head");
            }
            else {
                cell.classList.remove("fill");
            }
        })

        // Collision Testing 
        const isCollision = snake.some(segment =>
            head.x == segment.x && head.y == segment.y
        )
        if (isCollision) {
            clearInterval(gameloop);
            clearInterval(timeInterval);
            GameOverScreen.style.display = "flex";
            RestartButton.addEventListener("click", RestartGame);
            return;
        }

        //food consuming logic

        if (food.x == head.x && food.y == head.y) {

            boxArray[`${food.x}-${food.y}`].classList.remove("food");
            food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * column) };
            while (snake.some(segment =>
                food.x == segment.x && food.y == segment.y
            )) {
                food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * column) };
            }

            boxArray[`${food.x}-${food.y}`].classList.add("food");
            snake.unshift(head);
            score += 1;
            scoreDisplay.textContent = `${score}`;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore.toString());
                highScore = parseInt(localStorage.getItem("highScore"));
                highScoreDisplay.textContent = `${highScore}`;
            }
        }
        snake.unshift(head);
        snake.pop();
        render();
    }, 200)
}

main.style.display = "grid";
main.style.gridTemplateColumns = `repeat(auto-fit, minmax(${box}px, 1fr))`;
main.style.gridTemplateRows = `repeat(auto-fit, minmax(${box}px, 1fr))`;
const foodArray = [];
const boxArray = [];

//creating game area
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < column; j++) {
        const div = document.createElement('div');
        div.style.height = `${box}px`;
        div.style.width = `${box}px`;
        div.style.border = "1px solid grey";
        div.style.fontSize = '12px';
        main.appendChild(div);
        boxArray[`${i}-${j}`] = div;
        foodArray.push(div);
    }
}

let snake = [{ x: 5, y: 5 }, { x: 5, y: 4 }];

let direction = "right";

function render() {
    snake.forEach((segment, index) => {
        cell = boxArray[`${segment.x}-${segment.y}`]
        if (index === 0) {
            cell.classList.add("head");
        }
        else {
            cell.classList.add("fill");
        }
    })
}

function renderRemove() {
    snake.forEach((segment, index) => {
        cell = boxArray[`${segment.x}-${segment.y}`]
        if (index === 0) {
            cell.classList.remove("head");
        }
        else {
            cell.classList.remove("fill");
        }
    })
}

//defining food
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * column) };
while (snake.some(segment =>
    food.x == segment.x && food.y == segment.y
)) {
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * column) };
}

boxArray[`${food.x}-${food.y}`].classList.add("food");

//keyboard arrow control unit

addEventListener("keydown", (event) => {
    if (event.key == "ArrowUp" && direction !== "down") {
        direction = "up";
    }
    else if (event.key == "ArrowDown" && direction !== "up") {
        direction = "down";
    }
    else if (event.key == "ArrowRight" && direction !== "left") {
        direction = "right";
    }
    else if (event.key == "ArrowLeft" && direction !== "right") {
        direction = "left";
    }
})






