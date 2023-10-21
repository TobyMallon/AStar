const canvas = document.getElementById("board");
const context = canvas.getContext("2d");

const board_width = canvas.width/20;
const board_height = canvas.height/20;

const board_border = 'black';
const board_background = "white";
const snake_col = 'lightblue';
const snake_border = 'darkblue';

let tick_time = 100;
let running = true;

let player_pos = [10, 10];

let ROW = 9;
let COL = 10;

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

function create_walls(grid, wall_num) {
    let walls = grid
    for (let i = 0; i < wall_num; i++) {
        const random_x = Math.floor(Math.random() * board_width)
        const random_y = Math.floor(Math.random() * board_height)
        walls[random_x][random_y][2] = 1;
    }
    return walls
}

let grid = create_grid();
console.log(grid);
let walls = create_walls(grid, 80);
console.log(walls)

function draw_player() {
    context.fillStyle = "black";
    context.fillRect(grid[
        player_pos[0]][player_pos[1]][0],
        grid[player_pos[0]][player_pos[1]][1],
        20,
        20)
}

function draw_walls() {
    for (let i = 0; i < board_width; i++) {
        for (let j = 0; j < board_height; j++) {
            if (walls[i][j][2] === 1) {
                context.fillStyle = "black"
                context.fillRect(walls[i][j][0], walls[i][j][1], 20, 20)
            } else {
                context.fillStyle = snake_col;
                context.strokestyle = snake_border;
                context.fillRect(grid[i][j][0], grid[i][j][1], 20, 20);
                context.strokeRect(grid[i][j][0], grid[i][j][1], 20, 20);
            }
        }
    }
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

function move(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const keypressed = event.keyCode;
    if (keypressed === LEFT_KEY) {
        player_pos[0] -= 1
    }
    if (keypressed === RIGHT_KEY) {
        player_pos[0] += 1
    }
    if (keypressed === UP_KEY) {
        player_pos[1] -= 1
    }
    if (keypressed === DOWN_KEY) {
        player_pos[1] += 1
    }
}

function main() {
    setTimeout(function onTick() {
        clearCanvas();
        //add();
        document.addEventListener("keydown", move)
        draw_player();
        draw_walls();

        if (running === true) {
            main();
        }
        else {
            console.log("Done!")
        }
    }, tick_time)
}

main()
