// TODO: change rows/columns to be square (have constant sqsize (in what unit?)), adjust number of rows/cols to fit
//      - or don't: it may cause fractional boxes or gaps at the boundaries?
const ROWS = 20;
const COLUMNS = 20;

enum Status {
  placingStart = "S",
  placingEnd = "E",
  placingWall = "W",
  removeWall = "R"
}

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

      cell.addEventListener("mousedown", () => {
        switch (window.status) {
          case "S":
            let starts = getCells().starts;
            if (starts.length > 0) {
              starts[0].classList.remove("start");
            }
            cell.classList.add("start");
            break;
          case "E":
            let ends = getCells().ends;
            if (ends.length > 0) {
              ends[0].classList.remove("end");
            }
            cell.classList.add("end");
            break;
          case "W":
            if (!getCells().walls.includes(cell))
              cell.classList.add("wall");
            break;
          case "R":
            if (getCells().walls.includes(cell))
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
            cell.classList.add("start");
            break;
          case "E":
            let ends = getCells().ends;
            if (ends.length > 0) {
              ends[0].classList.remove("end");
            }
            cell.classList.add("end");
            break;
          case "W":
            if (!getCells().walls.includes(cell))
              cell.classList.add("wall");
            break;
          case "R":
            if (getCells().walls.includes(cell))
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

function init() {
  defineGrid();
  addKeyPressHandlerToBody();
  window.status = Status.placingStart;
  updateStatusIndicator();
}

init();