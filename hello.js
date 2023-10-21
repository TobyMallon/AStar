const canvas = document.getElementById("board");
const context = canvas.getContext("2d");

const board_width = canvas.width/100;
const board_height = canvas.height/100;

const board_border = 'black';
const board_background = "white";
const snake_col = 'lightblue';
const snake_border = 'darkblue';

let tick_time = 100;
let running = true;

let player_pos = [10, 10];

let ROW = 100;
let COL = 100;

let path = []

class cell {
    constructor() {
        this.parent_i = 0;
        this.parent_j = 0;
        this.f = 0;
        this.g = 0;
        this.h = 0;
    }
}

function isValid(row, col) {
    return (row >= 0) && (row < ROW) && (col >= 0) && (col < COL);
}

function isUnblocked(grid, row, col) {
    return grid[row][col] === 1;
}

function isDestination(row, col, dest) {
    return row === dest[0] && col === dest[1];
}

function calculateHValue(row, col, dest) {
    return (Math.sqrt((row - dest[0]) * (row - dest[0]) + (col - dest[1]) * [col - dest[1]]));
}

function tracePath(cellDetails, dest) {
    console.log("the path is ");
    let row = dest[0];
    let col = dest[1];

    // stack<Pair> Path
    let Path = [];

    while (!(cellDetails[row][col].parent_i === row && cellDetails[row][col].parent_j === col)) {
        Path.push([row, col]);
        let temp_row = cellDetails[row][col].parent_i;
        let temp_col = cellDetails[row][col].parent_j;
        row = temp_row;
        col = temp_col;
    }

    Path.push([row, col]);
    while (Path.length > 0) {
        let p = Path[0];
        Path.shift();

        if (p[0] === 2 || p[0] === 1) {
            console.log("-> (" + p[0] + ", " + (p[1] - 1) + ")");
            path.push([p[0], p[1]-1])
        } else {
            console.log("-> (" + p[0] + ", " + (p[1]) + ")");
            path.push([p[0], p[1]])
        }

    }
}

function aStarSearch(grid, src, dest) {
    if (isValid(src[0], src[1]) === false) {
        console.log("Source is invalid\n");
        return;
    }

    if (isValid(dest[0], dest[1]) === false) {
        console.log("Destination is invalid\n");
        return;
    }

    if (isUnblocked(grid, src[0], src[1]) === false || isUnblocked(grid, dest[0], dest[1]) === false) {
        console.log("Source or the destination is blocked \n");
        return;
    }

    if (isDestination(src[0], src[1], dest) === true) {
        console.log("We are already at the destination\n");
        return;
    }

    let closedList = new Array(ROW);
    for (let i = 0; i < ROW; i++) {
        closedList[i] = new Array(COL).fill(false)
    }

    let cellDetails = new Array(ROW);
    for (let i = 0; i < ROW; i++) {
        cellDetails[i] = new Array(COL)
    }

    let i, j;

    for (i = 0; i < ROW; i++) {
        for (j = 0; j < COL; j++) {
            cellDetails[i][j] = new cell();
            cellDetails[i][j].f = 2147483647;
            cellDetails[i][j].g = 2147483647;
            cellDetails[i][j].h = 2147483647;
            cellDetails[i][j].parent_i = -1;
            cellDetails[i][j].parent_j = -1;
        }
    }

    i = src[0];
    j = src[1];
    cellDetails[i][j].f = 0;
    cellDetails[i][j].g = 0;
    cellDetails[i][j].h = 0;
    cellDetails[i][j].parent_i = i;
    cellDetails[i][j].parent_j = j;

    let openList = new Map();
    openList.set(0, [i, j])
    let foundDest = false;

    while (openList.size > 0) {
        let p = openList.entries().next().value
        openList.delete(p[0])
        i = p[1][0];
        j = p[1][1];
        closedList[i][j] = true;

        let gNew, hNew, fNew;

        if (isValid(i - 1, j) === true) {
            if (isDestination(i - 1, j, dest) === true) {
                cellDetails[i - 1][j].parent_i = i;
                cellDetails[i - 1][j].parent_j = j;
                console.log("The destination cell is found\n");
                tracePath(cellDetails, dest);
                foundDest = true;
                return;
            }

            else if (closedList[i - 1][j] === false && isUnblocked(grid, i - 1, j) === true) {
                gNew = cellDetails[i][j].g + 1;
                hNew = calculateHValue(i - 1, j, dest);
                fNew = gNew + hNew;

                if (cellDetails[i - 1][j].f === 2147483647 || cellDetails[i - 1][j].f > fNew) {
                    openList.set(fNew, [i - 1, j]);

                    cellDetails[i - 1][j].f = fNew;
                    cellDetails[i - 1][j].g = gNew;
                    cellDetails[i - 1][j].h = hNew;
                    cellDetails[i - 1][j].parent_i = i;
                    cellDetails[i - 1][j].parent_j = j;
                }
            }
        }

        if (isValid(i + 1, j) === true) {
            // If the destination cell is the same as the
            // current successor
            if (isDestination(i + 1, j, dest) === true) {
                // Set the Parent of the destination cell
                cellDetails[i + 1][j].parent_i = i;
                cellDetails[i + 1][j].parent_j = j;
                console.log("The destination cell is found\n");
                tracePath(cellDetails, dest);
                foundDest = true;
                return;
            }
                // If the successor is already on the closed
                // list or if it is blocked, then ignore it.
            // Else do the following
            else if (closedList[i + 1][j] === false
                && isUnblocked(grid, i + 1, j)
                === true) {
                gNew = cellDetails[i][j].g + 1;
                hNew = calculateHValue(i + 1, j, dest);
                fNew = gNew + hNew;

                // If it isn’t on the open list, add it to
                // the open list. Make the current square
                // the parent of this square. Record the
                // f, g, and h costs of the square cell
                //                OR
                // If it is on the open list already, check
                // to see if this path to that square is
                // better, using 'f' cost as the measure.
                if (cellDetails[i + 1][j].f === 2147483647
                    || cellDetails[i + 1][j].f > fNew) {
                    openList.set(fNew, [i + 1, j]);
                    // Update the details of this cell
                    cellDetails[i + 1][j].f = fNew;
                    cellDetails[i + 1][j].g = gNew;
                    cellDetails[i + 1][j].h = hNew;
                    cellDetails[i + 1][j].parent_i = i;
                    cellDetails[i + 1][j].parent_j = j;
                }
            }
        }

        //----------- 3rd Successor (East) ------------

        // Only process this cell if this is a valid one
        if (isValid(i, j + 1) === true) {
            // If the destination cell is the same as the
            // current successor
            if (isDestination(i, j + 1, dest) === true) {
                // Set the Parent of the destination cell
                cellDetails[i][j + 1].parent_i = i;
                cellDetails[i][j + 1].parent_j = j;
                console.log("The destination cell is found\n");
                tracePath(cellDetails, dest);
                foundDest = true;
                return;
            }

                // If the successor is already on the closed
                // list or if it is blocked, then ignore it.
            // Else do the following
            else if (closedList[i][j + 1] === false
                && isUnblocked(grid, i, j + 1)
                === true) {
                gNew = cellDetails[i][j].g + 1;
                hNew = calculateHValue(i, j + 1, dest);
                fNew = gNew + hNew;

                // If it isn’t on the open list, add it to
                // the open list. Make the current square
                // the parent of this square. Record the
                // f, g, and h costs of the square cell
                //                OR
                // If it is on the open list already, check
                // to see if this path to that square is
                // better, using 'f' cost as the measure.
                if (cellDetails[i][j + 1].f === 2147483647
                    || cellDetails[i][j + 1].f > fNew) {
                    openList.set(fNew, [i, j + 1]);

                    // Update the details of this cell
                    cellDetails[i][j + 1].f = fNew;
                    cellDetails[i][j + 1].g = gNew;
                    cellDetails[i][j + 1].h = hNew;
                    cellDetails[i][j + 1].parent_i = i;
                    cellDetails[i][j + 1].parent_j = j;
                }
            }
        }

        //----------- 4th Successor (West) ------------

        // Only process this cell if this is a valid one
        if (isValid(i, j - 1) === true) {
            // If the destination cell is the same as the
            // current successor
            if (isDestination(i, j - 1, dest) === true) {
                // Set the Parent of the destination cell
                cellDetails[i][j - 1].parent_i = i;
                cellDetails[i][j - 1].parent_j = j;
                console.log("The destination cell is found\n");
                tracePath(cellDetails, dest);
                foundDest = true;
                return;
            }

                // If the successor is already on the closed
                // list or if it is blocked, then ignore it.
            // Else do the following
            else if (closedList[i][j - 1] === false
                && isUnblocked(grid, i, j - 1)
                === true) {
                gNew = cellDetails[i][j].g + 1;
                hNew = calculateHValue(i, j - 1, dest);
                fNew = gNew + hNew;

                // If it isn’t on the open list, add it to
                // the open list. Make the current square
                // the parent of this square. Record the
                // f, g, and h costs of the square cell
                //                OR
                // If it is on the open list already, check
                // to see if this path to that square is
                // better, using 'f' cost as the measure.
                if (cellDetails[i][j - 1].f === 2147483647
                    || cellDetails[i][j - 1].f > fNew) {
                    openList.set(fNew, [i, j - 1]);

                    // Update the details of this cell
                    cellDetails[i][j - 1].f = fNew;
                    cellDetails[i][j - 1].g = gNew;
                    cellDetails[i][j - 1].h = hNew;
                    cellDetails[i][j - 1].parent_i = i;
                    cellDetails[i][j - 1].parent_j = j;
                }
            }
        }

        //----------- 5th Successor (North-East)
        //------------

        // Only process this cell if this is a valid one
        if (isValid(i - 1, j + 1) === true) {
            // If the destination cell is the same as the
            // current successor
            if (isDestination(i - 1, j + 1, dest) === true) {
                // Set the Parent of the destination cell
                cellDetails[i - 1][j + 1].parent_i = i;
                cellDetails[i - 1][j + 1].parent_j = j;
                console.log("The destination cell is found\n");
                tracePath(cellDetails, dest);
                foundDest = true;
                return;
            }

                // If the successor is already on the closed
                // list or if it is blocked, then ignore it.
            // Else do the following
            else if (closedList[i - 1][j + 1] === false
                && isUnblocked(grid, i - 1, j + 1)
                === true) {
                gNew = cellDetails[i][j].g + 1.414;
                hNew = calculateHValue(i - 1, j + 1, dest);
                fNew = gNew + hNew;

                // If it isn’t on the open list, add it to
                // the open list. Make the current square
                // the parent of this square. Record the
                // f, g, and h costs of the square cell
                //                OR
                // If it is on the open list already, check
                // to see if this path to that square is
                // better, using 'f' cost as the measure.
                if (cellDetails[i - 1][j + 1].f === 2147483647
                    || cellDetails[i - 1][j + 1].f > fNew) {
                    openList.set(fNew, [i - 1, j + 1]);

                    // Update the details of this cell
                    cellDetails[i - 1][j + 1].f = fNew;
                    cellDetails[i - 1][j + 1].g = gNew;
                    cellDetails[i - 1][j + 1].h = hNew;
                    cellDetails[i - 1][j + 1].parent_i = i;
                    cellDetails[i - 1][j + 1].parent_j = j;
                }
            }
        }

        //----------- 6th Successor (North-West)
        //------------

        // Only process this cell if this is a valid one
        if (isValid(i - 1, j - 1) === true) {
            // If the destination cell is the same as the
            // current successor
            if (isDestination(i - 1, j - 1, dest) === true) {
                // Set the Parent of the destination cell
                cellDetails[i - 1][j - 1].parent_i = i;
                cellDetails[i - 1][j - 1].parent_j = j;
                console.log("The destination cell is found\n");
                tracePath(cellDetails, dest);
                foundDest = true;
                return;
            }

                // If the successor is already on the closed
                // list or if it is blocked, then ignore it.
            // Else do the following
            else if (closedList[i - 1][j - 1] === false
                && isUnblocked(grid, i - 1, j - 1)
                === true) {
                gNew = cellDetails[i][j].g + 1.414;
                hNew = calculateHValue(i - 1, j - 1, dest);
                fNew = gNew + hNew;

                // If it isn’t on the open list, add it to
                // the open list. Make the current square
                // the parent of this square. Record the
                // f, g, and h costs of the square cell
                //                OR
                // If it is on the open list already, check
                // to see if this path to that square is
                // better, using 'f' cost as the measure.
                if (cellDetails[i - 1][j - 1].f === 2147483647
                    || cellDetails[i - 1][j - 1].f > fNew) {
                    openList.set(fNew, [i - 1, j - 1]);
                    // Update the details of this cell
                    cellDetails[i - 1][j - 1].f = fNew;
                    cellDetails[i - 1][j - 1].g = gNew;
                    cellDetails[i - 1][j - 1].h = hNew;
                    cellDetails[i - 1][j - 1].parent_i = i;
                    cellDetails[i - 1][j - 1].parent_j = j;
                }
            }
        }

        //----------- 7th Successor (South-East)
        //------------

        // Only process this cell if this is a valid one
        if (isValid(i + 1, j + 1) === true) {
            // If the destination cell is the same as the
            // current successor
            if (isDestination(i + 1, j + 1, dest) === true) {
                // Set the Parent of the destination cell
                cellDetails[i + 1][j + 1].parent_i = i;
                cellDetails[i + 1][j + 1].parent_j = j;
                console.log("The destination cell is found\n");
                tracePath(cellDetails, dest);
                foundDest = true;
                return;
            }

                // If the successor is already on the closed
                // list or if it is blocked, then ignore it.
            // Else do the following
            else if (closedList[i + 1][j + 1] === false
                && isUnblocked(grid, i + 1, j + 1)
                === true) {
                gNew = cellDetails[i][j].g + 1.414;
                hNew = calculateHValue(i + 1, j + 1, dest);
                fNew = gNew + hNew;

                // If it isn’t on the open list, add it to
                // the open list. Make the current square
                // the parent of this square. Record the
                // f, g, and h costs of the square cell
                //                OR
                // If it is on the open list already, check
                // to see if this path to that square is
                // better, using 'f' cost as the measure.
                if (cellDetails[i + 1][j + 1].f === 2147483647
                    || cellDetails[i + 1][j + 1].f > fNew) {
                    openList.set(fNew, [i + 1, j + 1]);

                    // Update the details of this cell
                    cellDetails[i + 1][j + 1].f = fNew;
                    cellDetails[i + 1][j + 1].g = gNew;
                    cellDetails[i + 1][j + 1].h = hNew;
                    cellDetails[i + 1][j + 1].parent_i = i;
                    cellDetails[i + 1][j + 1].parent_j = j;
                }
            }
        }

        //----------- 8th Successor (South-West)
        //------------

        // Only process this cell if this is a valid one
        if (isValid(i + 1, j - 1) === true) {
            // If the destination cell is the same as the
            // current successor
            if (isDestination(i + 1, j - 1, dest) === true) {
                // Set the Parent of the destination cell
                cellDetails[i + 1][j - 1].parent_i = i;
                cellDetails[i + 1][j - 1].parent_j = j;
                console.log("The destination cell is found\n");
                tracePath(cellDetails, dest);
                foundDest = true;
                return;
            }

                // If the successor is already on the closed
                // list or if it is blocked, then ignore it.
            // Else do the following
            else if (closedList[i + 1][j - 1] === false
                && isUnblocked(grid, i + 1, j - 1)
                === true) {
                gNew = cellDetails[i][j].g + 1.414;
                hNew = calculateHValue(i + 1, j - 1, dest);
                fNew = gNew + hNew;

                // If it isn’t on the open list, add it to
                // the open list. Make the current square
                // the parent of this square. Record the
                // f, g, and h costs of the square cell
                //                OR
                // If it is on the open list already, check
                // to see if this path to that square is
                // better, using 'f' cost as the measure.
                if (cellDetails[i + 1][j - 1].f === 3.4e+38
                    || cellDetails[i + 1][j - 1].f > fNew) {
                    openList.set(fNew, [i + 1, j - 1]);

                    // Update the details of this cell
                    cellDetails[i + 1][j - 1].f = fNew;
                    cellDetails[i + 1][j - 1].g = gNew;
                    cellDetails[i + 1][j - 1].h = hNew;
                    cellDetails[i + 1][j - 1].parent_i = i;
                    cellDetails[i + 1][j - 1].parent_j = j;
                }
            }
        }
    }

    // When the destination cell is not found and the open
    // list is empty, then we conclude that we failed to
    // reach the destination cell. This may happen when the
    // there is no way to destination cell (due to
    // blockages)
    if (foundDest === false) {
        console.log("Failed to find the Destination Cell\n");
    }
}

let test_grid =
       [[1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
        [0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
        [1, 1, 1, 0, 0, 0, 1, 1, 1, 0],
        [1, 0, 1, 1, 1, 1, 0, 1, 0, 0],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 1, 0, 0, 1]];

// Source is the left-most bottom-most corner
let src = [0, 0];
let grid = create_grid(100)
// Destination is the left-most top-most corner
let dest = [99, 99];
aStarSearch(grid, src, dest);
console.log(path)

function main() {
    setTimeout(function onTick() {
        clearCanvas();
        drawBoard();
        drawPath();
        if (running === true) {
            main();
        }
        else {
            console.log("Done!")
        }
    }, tick_time)
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

function drawBoard() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === 0) {
                context.fillStyle = "black";
                context.fillRect(i * board_width, j * board_height, board_width, board_height)
            } else {
                context.fillStyle = snake_col;
                context.strokestyle = snake_border;
                context.fillRect(i * board_width, j * board_height, board_width, board_height)
                context.strokeRect(i * board_width, j * board_height, board_width, board_height)
            }

        }
    }
}

function drawPath() {
    for (let i = 0; i < path.length; i++) {
        context.fillStyle = "red";
        context.fillRect(path[i][0] * board_width, path[i][1] * board_height, board_width, board_height);
    }
}

function create_grid(height) {
    let temp_grid = []
    for (let i = 0; i < height; i++) {
        let temp_row = []
        for (let j = 0; j < height; j++) {
            if (Math.random() > 0.2) {
                temp_row.push(1)
            } else temp_row.push(0)
        }
        temp_grid.push(temp_row)
    }
    return temp_grid

}

main();
