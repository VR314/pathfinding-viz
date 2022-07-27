"use strict";
const ROWS = 20;
const COLUMNS = 20;
var Status;
(function (Status) {
    Status["placingStart"] = "S";
    Status["placingEnd"] = "E";
    Status["placingWall"] = "W";
})(Status || (Status = {}));
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
function addKeyPressHandler() {
    let body = document.getElementsByTagName("body")[0];
    body.onkeyup = (e) => {
        switch (e.key) {
            case " ":
                console.log("SPACE");
                break;
            default:
                console.log(e.key);
                break;
        }
    };
}
function init() {
    defineGrid();
    addKeyPressHandler();
    window.status = Status.placingStart;
    let status = document.getElementById("status");
    if (status) {
        status.textContent = "Status: " + window.status;
    }
}
init();
