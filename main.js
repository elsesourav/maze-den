const cvs = document.getElementById("myCvs");
const c = cvs.getContext("2d");

let fps = 10;
const scale = 4;
let rows = 16;
let cols = 26;
let size = 1;
const colors = ["#000", "#fff"];
const maze = new Maze(c, 5, 5, 2, scale);

rowsTxt.innerText = rows;
_columns.value = cols;
_speed.value = fps;
speedTxt.innerText = fps;

function reset(r, c, is = false) {
  if (r === rows && c === cols && !is) return;
  rows = r;
  cols = c;
  const nr = r + 1;
  const nc = c + 1;
  
  size = Math.floor(window.innerWidth / nr);
  cvs.width = nr * size * scale;
  cvs.height = nc * size * scale;
  cvsParent.style.width = `${nr * size - 20}px`
  cvsParent.style.height = `${nc * size - 20}px`
  rowsTxt.innerText = r;
  columnsTxt.innerText = c;
  
  maze.reset(r, c, size * scale);
  maze.draw();
}
reset(rows, cols, true)

function animation() {
  if (!maze.complete) {
    c.clearRect(0, 0, cvs.width, cvs.height);
    maze.update();
    maze.draw();
  }

  setTimeout(animation, 1000 / fps);
}
setTimeout(animation, 1000 / fps);

function toggleColors() {
  const tempColor = colors[0];
  colors[0] = colors[1];
  colors[1] = tempColor;
  
  maze.setStrockColor(colors[0]);
  maze.setFinalFillColor(colors[1]);
  document.body.style.background = colors[0];
}