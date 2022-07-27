let s = "test";
console.log(s);

const ROWS = 20;
const COLUMNS = 20;


function defineGrid() {
  let container = document.getElementById("container");
  if (container != null) {
    container.style.gridTemplateColumns = `${100/(COLUMNS)}%`.repeat(COLUMNS);
    container.style.gridTemplateRows =  `${100/(ROWS)}%`.repeat(ROWS);
  }

  // indexing like a MATLAB matrix: (r, c)
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