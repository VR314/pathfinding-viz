"use strict";
let s = "test";
console.log(s);
const ROWS = 20;
const COLUMNS = 20;
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
defineGrid();
