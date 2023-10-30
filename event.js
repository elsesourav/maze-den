const stngInfo = settingBtn.getBoundingClientRect();
const ww = window.innerWidth;
const wh = window.innerHeight;
const stngPos = {
  x: 20,
  y: 20
}
let isStart = false;
let mainOpen = false;

function ins() {
  isStart = true;
  settingBtn.classList.add("active");
}

function outs() {
  isStart = false;
  setTimeout(() => {
    settingBtn.classList.remove("active");
  }, 00);
}
function settingMove({x, y}) {
  if (isStart) {
    const ny = y - stngInfo.height / 2;
    const nx = x - stngInfo.width / 2;
    
    if (nx >= 0 && nx <= ww - stngInfo.width) {
      settingBtn.style.left = `${nx}px`;
    }
    if (ny >= 0 && ny <= wh - stngInfo.height) {
      settingBtn.style.top = `${ny}px`;
    }
  }
}

function setupMain(is = false) {
  if (is) {
    main.style.bottom = `${0}px`;
  } else {
    const mainInfo = main.getBoundingClientRect();
    main.style.bottom = `-${mainInfo.width}px`;
  }
}


settingBtn.addEventListener("touchstart", ins);
settingBtn.addEventListener("mousedown", ins);
document.body.addEventListener("touchend", outs);
document.body.addEventListener("mouseup", outs);
document.body.addEventListener("touchmove", (e) => {
  settingMove({ x: e.touches[0].clientX, y: e.touches[0].clientY });
});
document.body.addEventListener("mousemove", (e) => {
  settingMove({ x: e.clientX, y: e.clientY })
});

setupMain();
settingBtn.style.top = `${
  window.innerHeight - main.getBoundingClientRect().height - 80}px`;
settingBtn.style.left = `${
  window.innerWidth - stngInfo.width - 80}px`;
  
settingBtn.addEventListener("click", () => {
  mainOpen = !mainOpen;
  setupMain(mainOpen);
});

_rows.addEventListener("change", (e) => {
  reset(Number(e.target.value), cols);
});
_columns.addEventListener("change", (e) => {
  reset(rows, Number(e.target.value));
});
_speed.addEventListener("change", (e) => {
  fps = e.target.value;
  speedTxt.innerText = fps;
});
resetMaze.addEventListener("click", (e) => {
  reset(rows, cols, true);
});

_rows.addEventListener("input", (e) => {
  rowsTxt.innerText = Number(e.target.value);
});
_columns.addEventListener("input", (e) => {
  columnsTxt.innerText = Number(e.target.value);
});
_speed.addEventListener("input", (e) => {
  speedTxt.innerText = Number(e.target.value);
});

toggleColor.addEventListener("click", toggleColors);