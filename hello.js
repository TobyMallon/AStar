const canvas = document.getElementById("board");
const context = canvas.getContext("2d");

const board_width = canvas.width/20
const board_height = canvas.height/20

const board_border = 'black';
const board_background = "white";
const snake_col = 'lightblue';
const snake_border = 'darkblue';

let tick_time = 100;
let running = true;

let player_pos = [10, 10]

function create_grid() {

    let grid = []
    for (let i = 0; i < canvas.width; i += 20) {
        let x = []
        for (let j = 0; j <canvas.height; j += 20) {
            x.push([i, j, 0]);
        }
        grid.push(x);
    }
    return grid
}

let grid = create_grid();
console.log(grid);

function draw_grid() {
    for (let i = 0; i < board_width; i++) {
        for (let j = 0; j < board_height; j++) {
            context.fillStyle = snake_col;
            context.strokestyle = snake_border;
            context.fillRect(grid[i][j][0], grid[i][j][1], 20, 20);
            context.strokeRect(grid[i][j][0], grid[i][j][1], 20, 20);
        }
    }
}

function draw_player() {
    context.fillStyle = "black";
    context.fillRect(grid[
        player_pos[0]][player_pos[1]][0],
        grid[player_pos[0]][player_pos[1]][1],
        20,
        20)
}

function clearCanvas() {
    //  Select the colour to fill the drawing
    context.fillStyle = board_background;
    //  Select the colour for the border of the canvas
    context.strokestyle = board_border;
    // Draw a "filled" rectangle to cover the entire canvas
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Draw a "border" around the entire canvas
    context.strokeRect(0, 0, canvas.width, canvas.height);
}

function move() {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
}

function main() {
    setTimeout(function onTick() {
        clearCanvas();
        //add();
        draw_grid();
        document.addEventListener("keydown", move)
        draw_player();

        if (running === true) {
            main();
        }
        else {
            console.log("Done!")
        }
    }, tick_time)
}

main()
