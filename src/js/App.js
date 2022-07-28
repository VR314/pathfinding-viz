"use strict";
const ROWS = 20;
const COLUMNS = 20;
var Status;
(function (Status) {
    Status["placingStart"] = "S";
    Status["placingEnd"] = "E";
    Status["placingWall"] = "W";
    Status["removeWall"] = "R";
})(Status || (Status = {}));
function getCells() {
    let cells = document.getElementsByClassName("cell");
    let starts = [...cells].filter((cell) => cell.classList.contains("start"));
    let ends = [...cells].filter((cell) => cell.classList.contains("end"));
    let walls = [...cells].filter((cell) => cell.classList.contains("wall"));
    let selected = [...cells].filter((cell) => cell.classList.contains("selected"));
    return {
        starts,
        ends,
        walls,
        selected
    };
}
function defineGrid() {
    let container = document.getElementById("container");
    if (container != null) {
        container.style.gridTemplateColumns = `${100 / (COLUMNS)}%`.repeat(COLUMNS);
        container.style.gridTemplateRows = `${100 / (ROWS)}%`.repeat(ROWS);
    }
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = `${(i) * COLUMNS + j}`;
            cell.style.border = "solid 0.7px black";
            cell.addEventListener("mouseenter", (e) => {
                cell.classList.add("hoverCell");
            });
            cell.addEventListener("mouseleave", () => {
                cell.classList.remove("hoverCell");
            });
            cell.addEventListener("mousedown", () => {
                switch (window.status) {
                    case "S":
                        let starts = getCells().starts;
                        if (starts.length > 0) {
                            starts[0].classList.remove("start");
                        }
                        if (cell.classList.contains("wall")) {
                            cell.classList.remove("wall");
                        }
                        cell.classList.add("start");
                        break;
                    case "E":
                        let ends = getCells().ends;
                        if (ends.length > 0) {
                            ends[0].classList.remove("end");
                        }
                        if (cell.classList.contains("wall")) {
                            cell.classList.remove("wall");
                        }
                        cell.classList.add("end");
                        break;
                    case "W":
                        if (!cell.classList.contains("wall"))
                            cell.classList.add("wall");
                        break;
                    case "R":
                        if (cell.classList.contains("wall"))
                            cell.classList.remove("wall");
                    default:
                        console.log(window.status);
                        break;
                }
            });
            cell.addEventListener("mouseover", (e) => {
                if (e.buttons !== 1) {
                    return;
                }
                switch (window.status) {
                    case "S":
                        let starts = getCells().starts;
                        if (starts.length > 0) {
                            starts[0].classList.remove("start");
                        }
                        if (cell.classList.contains("wall")) {
                            cell.classList.remove("wall");
                        }
                        cell.classList.add("start");
                        break;
                    case "E":
                        let ends = getCells().ends;
                        if (ends.length > 0) {
                            ends[0].classList.remove("end");
                        }
                        if (cell.classList.contains("wall")) {
                            cell.classList.remove("wall");
                        }
                        cell.classList.add("end");
                        break;
                    case "W":
                        if (!cell.classList.contains("wall"))
                            cell.classList.add("wall");
                        break;
                    case "R":
                        if (cell.classList.contains("wall"))
                            cell.classList.remove("wall");
                    default:
                        console.log(window.status);
                        break;
                }
            });
            container?.appendChild(cell);
        }
    }
}
function toggleSettings() {
    let settings = document.getElementsByClassName('setting');
    console.log(settings);
    [...settings].forEach(s => {
        if (s.classList.contains("collapsed"))
            s.classList.remove("collapsed");
        else
            s.classList.add("collapsed");
    });
}
function addKeyPressHandlerToBody() {
    let body = document.getElementsByTagName("body")[0];
    body.onkeyup = (e) => {
        switch (e.key.toUpperCase()) {
            case "S":
                window.status = Status.placingStart;
                break;
            case "E":
                window.status = Status.placingEnd;
                break;
            case "W":
                window.status = Status.placingWall;
                break;
            case "R":
                window.status = Status.removeWall;
                break;
            default:
                console.log(e.key);
                break;
        }
        updateStatusIndicator();
    };
}
function updateStatusIndicator() {
    let status = document.getElementById("status");
    if (status) {
        status.textContent = "Status: " + window.status;
    }
}
function id(element) {
    return parseInt(element.id);
}
function getPassed(gs) {
    let passed = new Array(ROWS);
    for (let i = 0; i < gs.length; i++) {
        passed[i] = new Array(COLUMNS);
        for (let j = 0; j < gs[i].length; j++) {
            passed[i][j] = (gs[i][j] !== null && gs[i][j] !== undefined);
        }
    }
    console.log(gs);
    return passed;
}
function idToRC(id) {
    let r = Math.floor(id / COLUMNS);
    return { r, c: id % COLUMNS };
}
function getDist(curr, target) {
    let currRC = idToRC(curr);
    let targetRC = idToRC(target);
    return (Math.min(Math.abs(currRC.c - targetRC.c), Math.abs(currRC.r - targetRC.r)) * 14) + (Math.abs(Math.abs(currRC.c - targetRC.c) - Math.abs(currRC.r - targetRC.r)) * 10);
}
function toSearch(item, walls, selected, passed) {
    if (!walls.includes(item) && !selected.includes(item) && !passed[Math.floor(id(item) / COLUMNS)][id(item) % COLUMNS]) {
        return true;
    }
    else {
        return false;
    }
}
function updateGHs(gs, hs) {
    let passed = getPassed(gs);
    console.log(passed);
    for (let i = 0; i < passed.length; i++) {
        for (let j = 0; j < passed[i].length; j++) {
            if (passed[i][j]) {
                let cell = document.getElementById(`${i * COLUMNS + j}`);
                if (cell) {
                    console.log(id(cell));
                    cell.style.padding = "5px";
                    cell.innerHTML = `
          <p style="margin:0px">${gs[i][j]}
            <span style="float:right">${hs[i][j]}</span>
          </p><p style="text-align: center; margin:0px;" >${hs[i][j] + gs[i][j]}</p>
          `;
                }
            }
        }
    }
}
function getNeighbors(id) {
    let res = [id - COLUMNS - 1, id - COLUMNS, id - COLUMNS + 1,
        id - 1, id + 1,
        id + COLUMNS - 1, id + COLUMNS, id + COLUMNS + 1];
    res = res.filter((el) => el >= 0 && el < ROWS * COLUMNS);
    return res;
}
function AStar() {
    let { starts, ends, walls } = getCells();
    const START = starts[0];
    const END = ends[0];
    let completed = false;
    let gs = new Array(ROWS);
    let hs = new Array(ROWS);
    let parents = new Array(ROWS * COLUMNS);
    for (let i = 0; i < ROWS; i++) {
        gs[i] = new Array(COLUMNS);
        hs[i] = new Array(COLUMNS);
    }
    let open = [id(START)];
    let closed = [];
    walls.forEach((el) => {
        closed.push(id(el));
    });
    while (open.length > 0 && open[open.length - 1] !== id(END)) {
        let curr = open.pop();
        if (curr === undefined) {
            console.error("ERROR!");
            return;
        }
        closed.push(curr);
        let neighbors = getNeighbors(curr);
        neighbors.filter((el) => !closed.includes(el));
        for (let n of neighbors) {
            if (!open.includes(n) && !closed.includes(n)) {
                open.push(n);
                let { r, c } = idToRC(n);
                gs[r][c] = getDist(n, id(START));
                hs[r][c] = getDist(n, id(END));
                parents[n] = curr;
            }
        }
        open = open.sort((a, b) => {
            let { r: aR, c: aC } = idToRC(a);
            let { r: bR, c: bC } = idToRC(b);
            return 0 - (gs[aR][aC] + hs[aR][aC]) + (gs[bR][bC] + hs[bR][bC]);
            s;
        });
        updateGHs(gs, hs);
    }
    let curr = parents[id(END)];
    while (curr !== id(START)) {
        document.getElementById(`${curr}`)?.classList.add("searched");
        curr = parents[curr];
        console.log(curr);
    }
}
function runAStar() {
    let { starts, ends, walls, selected } = getCells();
    const START = starts[0];
    const END = ends[0];
    let completed = false;
    let gs = new Array(ROWS);
    let hs = new Array(ROWS);
    for (let i = 0; i < ROWS; i++) {
        gs[i] = new Array(COLUMNS);
        hs[i] = new Array(COLUMNS);
    }
    let outermost = [START];
    while (!completed) {
        let queue = [];
        let passed = getPassed(gs);
        for (let i = 0; i < outermost.length; i++) {
            let borders = [document.getElementById(`${id(outermost[0]) - COLUMNS - 1}`), document.getElementById(`${id(outermost[0]) - COLUMNS}`), document.getElementById(`${id(outermost[0]) - COLUMNS + 1}`), document.getElementById(`${id(outermost[0]) - 1}`), document.getElementById(`${id(outermost[0]) + 1}`), document.getElementById(`${id(outermost[0]) + COLUMNS - 1}`), document.getElementById(`${id(outermost[0]) + COLUMNS}`), document.getElementById(`${id(outermost[0]) + COLUMNS + 1}`),];
            borders.forEach((el) => {
                if (el != null) {
                    if (toSearch(el, walls, selected, passed)) {
                        queue.push(el);
                    }
                }
            });
            let minSum = Infinity;
            let nextCell = queue[0];
            let minHs = Infinity;
            let sums = [];
            for (let j = 0; j < queue.length; j++) {
                let { r, c } = idToRC(id(queue[j]));
                gs[r][c] = getDist(id(START), id(queue[j]));
                hs[r][c] = getDist(id(END), id(queue[j]));
                sums[j] = gs[r][c] + hs[r][c];
                if (sums[j] < minSum) {
                    minSum = sums[j];
                    nextCell = queue[j];
                    minHs = hs[r][c];
                }
                else if (sums[j] == minSum) {
                    if (hs[r][c] < minHs) {
                        minSum = sums[j];
                        nextCell = queue[j];
                        minHs = hs[r][c];
                    }
                }
            }
            outermost = [nextCell];
            let cell = document.getElementById(`${id(nextCell)}`);
            if (getCells().ends[0] === nextCell) {
                completed = true;
            }
            if (cell) {
                console.log(id(cell));
                cell.classList.add("searched");
            }
            updateGHs(gs, hs);
        }
    }
    return true;
}
function init() {
    defineGrid();
    addKeyPressHandlerToBody();
    window.status = Status.placingStart;
    updateStatusIndicator();
}
init();
