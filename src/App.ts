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


      // TODO: move all mouse handler logic into one method (objects ARE passed by reference)
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

function id(element: Element): number {
  return parseInt(element.id);
}

function getPassed(gs: number[][]): boolean[][] {
  let passed: boolean[][] = new Array(ROWS);
  for (let i = 0; i < gs.length; i++) {
    passed[i] = new Array(COLUMNS);
    for (let j = 0; j < gs[i].length; j++) {
      passed[i][j] = (gs[i][j] !== null && gs[i][j] !== undefined && gs[i][j] !== 0);
    }
  }
  return passed;
}

function idToRC(id: number) {
  return { r: id / COLUMNS, c: id % COLUMNS };
}

function getH(curr: number, target: number): number {
  let currRC = idToRC(curr);
  let targetRC = idToRC(target);
  return Math.min(Math.abs(currRC.c - targetRC.c), Math.abs(currRC.r - targetRC.c)) * 14 + Math.abs(Math.abs(currRC.c - targetRC.c) - Math.abs(currRC.r - targetRC.c)) * 10;
}

function toSearch(item: Element, walls: Element[], passed: boolean[][]) {
  if (!walls.includes(item) && !passed[Math.floor(id(item) / COLUMNS)][id(item) % COLUMNS]) {
    return true;
  } else {
    return false;
  }
}

function runAStar() {
  // TODO: remove the event handlers for placing tiles, to prevent interference during the algo running

  let { starts, ends, walls } = getCells();
  const START = starts[0];
  const END = ends[0];
  let completed = false;

  let gs: number[][] = new Array(ROWS);
  let hs: number[][] = new Array(ROWS);
  for (let i = 0; i < ROWS; i++) {
    gs[i] = new Array(COLUMNS);
    hs[i] = new Array(COLUMNS);
  }

  let outermost = [START];


  while (!completed) {
    let queue:Element[] = [];
    let passed = getPassed(gs);
    console.log(passed);
    for (let i = 0; i < outermost.length; i++) {
      let borders = [document.getElementById(`${id(outermost[0]) - COLUMNS - 1}`), document.getElementById(`${id(outermost[0]) - COLUMNS}`), document.getElementById(`${id(outermost[0]) - COLUMNS + 1}`), document.getElementById(`${id(outermost[0]) - 1}`), document.getElementById(`${id(outermost[0]) + 1}`), document.getElementById(`${id(outermost[0]) + COLUMNS - 1}`),document.getElementById(`${id(outermost[0]) + COLUMNS}`),document.getElementById(`${id(outermost[0]) + COLUMNS + 1}`),];

      borders.forEach((el) => {
        if(el != null) {
          if(toSearch(el, walls, passed)) {
            queue.push(el);
          }
        }
      });

      console.log(queue);
    }

    completed = true;
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