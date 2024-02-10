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
}
function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    // board = [
    //     [2, 2, 2, 2],
    //     [2, 2, 2, 2],
    //     [4, 4, 8, 8],
    //     [4, 4, 8, 8]
    // ]
    for (let r = 0;r < rows;r++){
        for (let c = 0; c < columns;c++){
            let tile = document.createElement("div");
            tile.id = r.toString()+"-"+c.toString();
            let num = board[r][c];
            updateTile(tile,num);
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();
}
function hasEmptyTile(){
    let count = 0;
    for(let r = 0;r < rows;r++){
        for (let c = 0;c < columns;c++){
            if (board[r][c] == 0){
                return true;
            }
        }
    }
    return false;
}
function setTwo(){
    if (!hasEmptyTile()){
        return;
    }
    let found = false;
    while (!found){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random()*columns);
        if (board[r][c] == 0){
            board[r][c] = 2;
            let tile = document.getElementById(r.toString()+"-"+c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}
function updateTile(tile,num){
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0){
        tile.innerText = num;
        if (num <= 4096){
            tile.classList.add("x"+num.toString());
        }else{
            tile.classList.add("x8192");
        }
    }
}
document.addEventListener("keyup",(e) =>{
    if (e.code == "ArrowLeft"){
        slideLeft();
        setTwo();
    }
    else if (e.code == "ArrowRight"){
        slideRight();
        setTwo();
    }
    else if (e.code == "ArrowUp"){
        slideUp();
        setTwo();
    }
    else if (e.code == "ArrowDown"){
        slideDown();
        setTwo();
    }
    document.getElementById("score").innerText = score;
})
function filterZero(row){
    return row.filter(num => num!=0);
}
function slide(row){
    row = filterZero(row);

    //slide
    for (let i = 0; i < row.length-1; i++){
        if (row[i] == row[i+1]){
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row);
    while (row.length < columns){
        row.push(0);
    }
    return row;
}
function slideLeft(){
    for (let r = 0; r < rows;r++){
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0;c < columns; c++){
            let tile = document.getElementById(r.toString()+"-"+c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
}
function slideRight(){
    for (let r = 0; r < rows;r++){
        let row = board[r];
        row.reverse()
        row = slide(row);
        
        board[r] = row.reverse();
        for (let c = 0;c < columns; c++){
            let tile = document.getElementById(r.toString()+"-"+c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
}
function slideUp(){
    for (let c = 0;c < columns;c++){
        let row =[board[0][c],board[1][c],board[2][c],board[3][c]];
        row = slide(row);
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString()+"-"+c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
}
function slideDown(){
    for (let c = 0;c < columns;c++){
        let row = [board[0][c],board[1][c],board[2][c],board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0;r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString()+"-"+c.toString());
            let num = board[r][c];
            updateTile(tile,num);
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

