var board;
var score = 0;
var rows = 4;
var columns = 4;
var timerInterval; // Variable to hold the timer interval
var time = 0; // Variable to track time elapsed
var startTime;
var endTime;
window.onload = function() {
    setGame();
    startTime = new Date();
    startTimer();
    document.getElementById("playAgainBtn").addEventListener("click", resetGame);

}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // Create the game board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    // Initialize the game with two random tiles
    setTwo();
    setTwo();
}

function hasEmptyTile() {
    // Check if there are any empty tiles on the board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                return true;
            }
        }
    }
    return false;
}

function setTwo() {
    // Set a random empty tile to 2
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] === 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function updateTile(tile, num) {
    // Update the visual representation of a tile
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

document.addEventListener("keyup", (e) => {
    // Handle keyboard arrow key events
    if (e.code === "ArrowLeft") {
        slideLeft();
        setTwo();
    } else if (e.code === "ArrowRight") {
        slideRight();
        setTwo();
    } else if (e.code === "ArrowUp") {
        slideUp();
        setTwo();
    } else if (e.code === "ArrowDown") {
        slideDown();
        setTwo();
    }
    document.getElementById("score").innerText = score;

    // Check if the game is over after each move
    if (isGameOver()) {
        stopTimer();
        displayGameOver(); // Call displayGameOver here
    }
});


function filterZero(row) {
    // Filter out zero values from an array
    return row.filter(num => num !== 0);
}

function slide(row) {
    // Perform a slide operation on a row
    row = filterZero(row);

    // Merge adjacent equal numbers
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }

    // Remove zeros created by merging
    row = filterZero(row);

    // Pad row with zeros to match original length
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    // Slide all rows to the left
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        // Update tile visuals
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    // Slide all rows to the right
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;
        // Update tile visuals
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    // Slide all columns upwards
    for (let c = 0; c < columns; c++) {
        let column = [board[0][c], board[1][c], board[2][c], board[3][c]];
        column = slide(column);
        for (let r = 0; r < rows; r++) {
            board[r][c] = column[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    // Slide all columns downwards
    for (let c = 0; c < columns; c++) {
        let column = [board[0][c], board[1][c], board[2][c], board[3][c]];
        column.reverse();
        column = slide(column);
        column.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = column[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function isGameOver() {
    // Check if there are any possible moves left
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const current = board[r][c];
            // Check if current block can be merged with any adjacent block by sliding
            if (current === 0) return false; // If current block is empty, there's a possible move
            // Check adjacent blocks in all directions
            if ((c + 1 < columns && board[r][c + 1] === current) || // Right
                (c - 1 >= 0 && board[r][c - 1] === current) ||     // Left
                (r + 1 < rows && board[r + 1][c] === current) ||  // Down
                (r - 1 >= 0 && board[r - 1][c] === current)) {    // Up
                return false; // At least one possible move left, game is not over
            }
        }
    }
    return true; // No possible moves left, game over
}

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000); // Update timer every second
}

function updateTimer() {
    endTime = new Date(); // Record the current time
    var timeDiff = Math.floor((endTime - startTime) / 1000); // Calculate time difference in seconds

    var hours = Math.floor(timeDiff / 3600); // Calculate hours
    var minutes = Math.floor((timeDiff % 3600) / 60); // Calculate minutes
    var seconds = timeDiff % 60; // Calculate seconds

    // Format hours, minutes, and seconds to have leading zeros if necessary
    var formattedTime = 
        (hours < 10 ? "0" : "") + hours + ":" +
        (minutes < 10 ? "0" : "") + minutes + ":" +
        (seconds < 10 ? "0" : "") + seconds;

    document.getElementById("timer").innerText = formattedTime; // Update timer display
}

function stopTimer() {
    clearInterval(timerInterval); // Stop the timer
}


document.getElementById("playAgainBtn").addEventListener("click", function() {
    // Reset the game state
    resetGame();
});

function displayGameOver() {
    // Display the game over card
    document.getElementById("finalScore").innerText = score;
    document.getElementById("timeTaken").innerText = document.getElementById("timer").innerText;
    document.getElementById("gameOverCard").classList.remove("hidden");
}

function resetGame() {
    // Clear the existing game board
    clearBoard();

    // Reset score and timer
    score = 0;
    document.getElementById("score").innerText = score;
    stopTimer();
    document.getElementById("timer").innerText = "0s";

    // Hide the game over card
    document.getElementById("gameOverCard").classList.add("hidden");

    // Restart the game
    setGame();
    startTime = new Date();
    startTimer();
}

function clearBoard() {
    // Clear the visual representation of the game board
    var boardElement = document.getElementById("board");
    boardElement.innerHTML = "";
}

