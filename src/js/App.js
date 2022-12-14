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
    return {
        starts,
        ends,
        walls
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
function updateGHs(gs, hs) {
    let passed = getPassed(gs);
    console.log(passed);
    for (let i = 0; i < passed.length; i++) {
        for (let j = 0; j < passed[i].length; j++) {
            if (passed[i][j]) {
                let cell = document.getElementById(`${i * COLUMNS + j}`);
                if (cell) {
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
    const START = id(starts[0]);
    const END = id(ends[0]);
    let gs = new Array(ROWS);
    let hs = new Array(ROWS);
    let parents = new Array(ROWS * COLUMNS);
    for (let i = 0; i < ROWS; i++) {
        gs[i] = new Array(COLUMNS);
        hs[i] = new Array(COLUMNS);
    }
    let open = [START];
    let closed = [];
    walls.forEach((el) => {
        closed.push(id(el));
    });
    while (open.length > 0 && open[open.length - 1] !== END) {
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
                gs[r][c] = getDist(n, START);
                hs[r][c] = getDist(n, END);
                parents[n] = curr;
            }
        }
        open = open.sort((a, b) => {
            let { r: aR, c: aC } = idToRC(a);
            let { r: bR, c: bC } = idToRC(b);
            return 0 - (gs[aR][aC] + hs[aR][aC]) + (gs[bR][bC] + hs[bR][bC]);
        });
        updateGHs(gs, hs);
    }
    let curr = parents[END];
    while (curr !== START) {
        document.getElementById(`${curr}`)?.classList.add("searched");
        curr = parents[curr];
        console.log(curr);
    }
}
function init() {
    defineGrid();
    addKeyPressHandlerToBody();
    window.status = Status.placingStart;
    updateStatusIndicator();
}
init();
