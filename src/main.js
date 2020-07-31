/*
https://ja.wikipedia.org/wiki/%E3%83%A9%E3%82%A4%E3%83%95%E3%82%B2%E3%83%BC%E3%83%A0

誕生
    死んでいるセルに隣接する生きたセルがちょうど3つあれば、次の世代が誕生する。
生存
    生きているセルに隣接する生きたセルが2つか3つならば、次の世代でも生存する。
過疎
    生きているセルに隣接する生きたセルが1つ以下ならば、過疎により死滅する。
過密
    生きているセルに隣接する生きたセルが4つ以上ならば、過密により死滅する。
*/
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const screen = canvas.width;
const squares = 100;
const cell = screen / squares;
let cells = [];

// https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
let fps, fpsInterval, startTime, now, then, elapsed;

function createCells() {
    const arr = Array(squares);
    for (let i = 0; i < squares; i++) {
        arr[i] = Array(squares).fill(false);
    }
    return arr;
}

function randomCells() {
    for (let y = 0; y < squares; y++) {
        for (let x = 0; x < squares; x++) {
            if (Math.random() < 0.5) {
                cells[x][y] = true;
            }
        }
    }
}

function drawCells() {
    ctx.clearRect(0, 0, screen, screen);
    ctx.fillStyle = "black";
    for (let y = 0; y < squares; y++) {
        for (let x = 0; x < squares; x++) {
            if (cells[x][y]) {
                ctx.fillRect(x * cell, y * cell, cell, cell);
            }
        }
    }
}

function generation() {
    requestAnimationFrame(generation);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        let newCells = createCells();
        for (let y = 0; y < squares; y++) {
            for (let x = 0; x < squares; x++) {
                const neighbours = getCount(x, y);
                if (cells[x][y] && neighbours >= 2 && neighbours <= 3) {
                    newCells[x][y] = true;
                } else if (!cells[x][y] && neighbours == 3) {
                    newCells[x][y] = true;
                }
            }
        }
        cells = newCells;
        drawCells();
    }
}

function getCount(x, y) {
    let count = 0;
    for (let yy = -1; yy <= 1; yy++) {
        for (let xx = -1; xx <= 1; xx++) {
            if (xx === 0 && yy === 0) {
                continue;
            }
            let x2 = (squares + x + xx) % squares;
            let y2 = (squares + y + yy) % squares;
            if (cells[x2][y2]) {
                count++;
            }
        }
    }
    return count;
}

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    generation();
}

function main() {
    cells = createCells();
    randomCells();
    drawCells();
    startAnimating(20);
}

main();

